# 🤖 Arduino Fire Fighting Robot

An autonomous robot built on Arduino UNO R3 that detects fire using infrared flame sensors, navigates toward it while avoiding obstacles, and extinguishes it using a relay-driven water pump with a servo-aimed nozzle.

---

## Table of Contents

- [Features](#features)
- [Hardware Requirements](#hardware-requirements)
- [Pin Configuration](#pin-configuration)
- [System Architecture](#system-architecture)
- [Constants & Tuning Parameters](#constants--tuning-parameters)
- [Function Reference](#function-reference)
- [Program Flow](#program-flow)
- [Serial Monitor Output](#serial-monitor-output)
- [Wiring Notes](#wiring-notes)

---

## Features

- Three-sensor flame detection (left, center, right)
- Directional navigation toward fire source
- Ultrasonic obstacle avoidance with left/right decision logic
- Servo-aimed nozzle for targeted extinguishing
- Relay-controlled water pump (active-low and active-high support)
- Serial debug output for live sensor readings

---

## Hardware Requirements

| Component | Quantity |
|---|---|
| Arduino UNO R3 | 1 |
| IR Flame Sensor | 3 |
| HC-SR04 Ultrasonic Sensor | 1 |
| SG90 Servo Motor | 2 |
| L298N Motor Driver | 1 |
| DC Gear Motor | 2 |
| 5V Relay Module | 1 |
| Mini Water Pump | 1 |
| Chassis + Wheels | 1 set |

---

## Pin Configuration

### Flame Sensors

| Pin | Label | Description |
|---|---|---|
| A0 | `FLAME_L` | Left flame sensor analog input |
| A1 | `FLAME_C` | Center flame sensor analog input |
| A2 | `FLAME_R` | Right flame sensor analog input |

### Ultrasonic Sensor (HC-SR04)

| Pin | Label | Description |
|---|---|---|
| 9 | `TRIG` | Trigger pulse output |
| 10 | `ECHO` | Echo pulse input |

### Servo Motors

| Pin | Label | Description |
|---|---|---|
| 6 | `SERVO_PAN` | Pan servo (obstacle scan) |
| 5 | `SERVO_AIM` | Aim servo (nozzle direction) |

### Motor Driver (L298N)

| Pin | Label | Description |
|---|---|---|
| 2 | `IN1` | Left motor direction A |
| 4 | `IN2` | Left motor direction B |
| 7 | `IN3` | Right motor direction A |
| 8 | `IN4` | Right motor direction B |
| 11 | `ENA` | Left motor PWM speed |
| 3 | `ENB` | Right motor PWM speed |

### Pump

| Pin | Label | Description |
|---|---|---|
| 12 | `PUMP` | Relay signal for water pump |

---

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│                   MAIN LOOP                         │
│                                                     │
│  Read 3 flame sensors + ultrasonic distance         │
│              │                                      │
│    ┌─────────▼──────────┐                           │
│    │  Fire detected?    │── No ──▶ Stop + pump off  │
│    └─────────┬──────────┘                           │
│              │ Yes                                  │
│    ┌─────────▼──────────┐                           │
│    │  Distance ≤ 15 cm? │── Yes ──▶ Aim + Pump ON  │
│    └─────────┬──────────┘                           │
│              │ No                                   │
│    ┌─────────▼──────────┐                           │
│    │  Obstacle < 20 cm? │── Yes ──▶ Avoid obstacle │
│    └─────────┬──────────┘                           │
│              │ No                                   │
│    Navigate toward fire (forward / left / right)    │
└─────────────────────────────────────────────────────┘
```

---

## Constants & Tuning Parameters

All key thresholds and timings are defined at the top of the sketch for easy adjustment.

| Constant | Default | Description |
|---|---|---|
| `FLAME_THRESH` | `500` | Analog value below which a flame is considered detected. Lower = less sensitive. |
| `OBSTACLE_CM` | `20` | Distance (cm) at which obstacle avoidance triggers. |
| `EXTINGUISH_CM` | `15` | Distance (cm) at which the robot stops and activates the pump. |
| `SPD` | `170` | PWM drive speed for forward/backward motion (0–255). |
| `TURN_SPD` | `140` | PWM speed used during turns (slightly lower for control). |
| `BACK_MS` | `300` | Duration (ms) of the backward move during obstacle avoidance. |
| `TURN_MS` | `550` | Duration (ms) of the turn during obstacle avoidance. |
| `RELAY_ACTIVE_LOW` | `true` | Set `true` if relay triggers on LOW signal (most 5V relay modules). Set `false` for active-high relays. |

---

## Function Reference

### `setup()`

Initializes all pins, attaches servos to their pins, centers both servos at 90°, stops the motors, and turns the pump off. Prints `"Fire Fighting Robot Ready"` to Serial on completion.

---

### `loop()`

The main control loop. Runs on every cycle:

1. Reads analog values from all three flame sensors.
2. Compares each value against `FLAME_THRESH` to determine fire presence per side.
3. Reads ultrasonic distance.
4. Prints sensor data to Serial.
5. Branches into one of four behaviors: idle, extinguish, avoid obstacle, or navigate.

---

### `moveForward()`

Drives both motors forward at `SPD`.

Sets `IN1=HIGH, IN2=LOW` (left motor) and `IN3=HIGH, IN4=LOW` (right motor) with `ENA` and `ENB` both at `SPD`.

---

### `moveBackward()`

Drives both motors in reverse at `SPD`.

Sets `IN1=LOW, IN2=HIGH` and `IN3=LOW, IN4=HIGH`.

---

### `turnLeft()`

Reverses the left motor and drives the right motor forward at `TURN_SPD`, producing a left pivot turn.

---

### `turnRight()`

Drives the left motor forward and reverses the right motor at `TURN_SPD`, producing a right pivot turn.

---

### `stopMotors()`

Sets `ENA` and `ENB` to 0 and brings all IN pins LOW, fully stopping both motors.

---

### `getDistance()` → `long`

Fires a 10 µs pulse on `TRIG` and measures the echo duration on `ECHO` using `pulseIn()` with a 25 ms timeout.

Returns the distance in centimeters (`duration / 58`). Returns `999` if no echo is received (open space or sensor error).

---

### `avoidObstacle()`

Full obstacle avoidance sequence:

1. Stops motors.
2. Pans the scan servo to 160° (left), reads distance.
3. Pans to 20° (right), reads distance.
4. Returns servo to center (90°).
5. Backs up for `BACK_MS` milliseconds.
6. Turns left if left distance is greater or equal, otherwise turns right.
7. Holds the turn for `TURN_MS` milliseconds, then stops.

---

### `aimNozzle(bool leftFire, bool centerFire, bool rightFire)`

Positions the aim servo based on which flame sensors are active:

| Condition | Servo Angle |
|---|---|
| Center fire (or both sides) | 90° (straight ahead) |
| Left fire only | 135° (aimed left) |
| Right fire only | 45° (aimed right) |

Waits 250 ms after moving to allow the servo to settle before the pump activates.

**Parameters:**
- `leftFire` — `true` if the left flame sensor reads below `FLAME_THRESH`
- `centerFire` — `true` if the center flame sensor reads below `FLAME_THRESH`
- `rightFire` — `true` if the right flame sensor reads below `FLAME_THRESH`

---

### `pumpOn()`

Activates the relay to turn the pump on, respecting the `RELAY_ACTIVE_LOW` setting. Uses a `pumping` flag to avoid redundant writes. Prints `"PUMP ON"` to Serial on first activation.

- If `RELAY_ACTIVE_LOW = true` → writes `LOW` to `PUMP` pin
- If `RELAY_ACTIVE_LOW = false` → writes `HIGH` to `PUMP` pin

---

### `pumpOff()`

Deactivates the relay and resets the `pumping` flag. Inverts the logic of `pumpOn()` based on `RELAY_ACTIVE_LOW`.

---

## Program Flow

```
Power ON
   │
setup() ── servos center, motors stop, pump off
   │
loop() ──┬── No fire? ──────────────────────────▶ stopMotors() + pumpOff()
         │
         ├── Fire + distance ≤ 15 cm ──────────▶ stopMotors() → aimNozzle() → pumpOn()
         │
         ├── Fire + obstacle < 20 cm ──────────▶ pumpOff() → avoidObstacle()
         │
         └── Fire + clear path ────────────────▶ pumpOff() → navigate by sensor side
                                                   fC        → moveForward()
                                                   fL only   → turnLeft()
                                                   fR only   → turnRight()
                                                   fL + fR   → moveForward()
```

---

## Serial Monitor Output

Set baud rate to **9600**. Each loop prints one line:

```
L:342 C:289 R:610 D:23
```

| Field | Description |
|---|---|
| `L:` | Raw analog value from left flame sensor (0–1023) |
| `C:` | Raw analog value from center flame sensor (0–1023) |
| `R:` | Raw analog value from right flame sensor (0–1023) |
| `D:` | Ultrasonic distance in cm |

Lower analog values indicate stronger flame presence. Values below `FLAME_THRESH` (500) trigger detection.

---

## Wiring Notes

- The `RELAY_ACTIVE_LOW` constant must match your relay module. Most common 5V relay modules trigger on a LOW signal — leave this as `true`.
- `ENA` (pin 11) and `ENB` (pin 3) must be connected to PWM-capable pins on the L298N enable inputs for speed control to work.
- The pan servo scans for obstacles during avoidance; the aim servo only moves when the robot is stationary and extinguishing.
- Flame sensors should face slightly downward at roughly 45° to detect candle-height flames at ground level.
