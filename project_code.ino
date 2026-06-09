#include <Servo.h>
// —----------------------PIN DEFINITIONS—------------------
const int FLAME_L = A0;
const int FLAME_C = A1;
const int FLAME_R = A2;

const int TRIG = 9;
const int ECHO = 10;

const int SERVO_PAN = 6;
const int SERVO_AIM = 5;

const int IN1 = 2;
const int IN2 = 4;
const int IN3 = 7;
const int IN4 = 8;

const int ENA = 11;
const int ENB = 3;

const int PUMP = 12;

const int FLAME_THRESH = 500;
const int OBSTACLE_CM = 20;
const int EXTINGUISH_CM = 15;

const int SPD = 170;
const int TURN_SPD = 140;

const unsigned long BACK_MS = 300;
const unsigned long TURN_MS = 550;

const bool RELAY_ACTIVE_LOW = true;

Servo panServo;
Servo aimServo;

bool pumping = false;

// --------------------SETUP AREA----------------------
void setup() {
  Serial.begin(9600);

  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);

  pinMode(ENA, OUTPUT);
  pinMode(ENB, OUTPUT);
  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);
  pinMode(PUMP, OUTPUT);

  pumpOff();
  panServo.attach(SERVO_PAN);
  aimServo.attach(SERVO_AIM);

  panServo.write(90);
  aimServo.write(90);

  stopMotors();

  delay(1000);
  Serial.println("Fire Fighting Robot Ready");
}

// ------------------------MAIN LOOP---------------------------
void loop() {
  int vL = analogRead(FLAME_L);
  int vC = analogRead(FLAME_C);
  int vR = analogRead(FLAME_R);


  bool fL = (vL < FLAME_THRESH);
  bool fC = (vC < FLAME_THRESH);
  bool fR = (vR < FLAME_THRESH);


  bool fireDetected = fL || fC || fR;
  long distance = getDistance();


  Serial.print("L:");
  Serial.print(vL);
  Serial.print(" C:");
  Serial.print(vC);
  Serial.print(" R:");
  Serial.print(vR);
  Serial.print(" D:");
  Serial.println(distance);

  if (!fireDetected) {
    pumpOff();
    stopMotors();
    return;
  }

  if (distance <= EXTINGUISH_CM) {
    stopMotors();
    aimNozzle(fL, fC, fR);
    pumpOn();
    return;
  }

  if (distance < OBSTACLE_CM) {
    pumpOff();
    avoidObstacle();
    return;
  }
  pumpOff();
  if (fC) {
    moveForward();
  } else if (fL && !fR) {
    turnLeft();
  } else if (fR && !fL) {
    turnRight();
  } else {
    moveForward();
  }
}
void moveForward() {
  analogWrite(ENA, SPD);
  analogWrite(ENB, SPD);

  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);

  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);
}
void moveBackward() {
  analogWrite(ENA, SPD);
  analogWrite(ENB, SPD);

  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);

  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);
}
void turnLeft() {
  analogWrite(ENA, TURN_SPD);
  analogWrite(ENB, TURN_SPD);

  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);

  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);
}
void turnRight() {
  analogWrite(ENA, TURN_SPD);
  analogWrite(ENB, TURN_SPD);

  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);

  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);
}
void stopMotors() {
  analogWrite(ENA, 0);
  analogWrite(ENB, 0);

  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);

  digitalWrite(IN3, LOW);
  digitalWrite(IN4, LOW);
}
long getDistance() {
  digitalWrite(TRIG, LOW);
  delayMicroseconds(2);

  digitalWrite(TRIG, HIGH);
  delayMicroseconds(10);

  digitalWrite(TRIG, LOW);
  long duration = pulseIn(ECHO, HIGH, 25000);

  if (duration == 0)
    return 999;
  return duration / 58;
}
void avoidObstacle() {
  stopMotors();
  delay(150);

  panServo.write(160);
  delay(400);
  long leftDistance = getDistance();

  panServo.write(20);
  delay(400);
  long rightDistance = getDistance();

  panServo.write(90);
  delay(200);

  moveBackward();
  delay(BACK_MS);

  stopMotors();
  delay(100);

  if (leftDistance >= rightDistance) {
    turnLeft();
  } else {
    turnRight();
  }
  delay(TURN_MS);
  stopMotors();
}
void aimNozzle(bool leftFire, bool centerFire, bool rightFire) {
  if (centerFire) {
    aimServo.write(90);
  } else if (leftFire && !rightFire) {
    aimServo.write(135);
  } else if (rightFire && !leftFire) {
    aimServo.write(45);
  } else {
    aimServo.write(90);
  }
  delay(250);
}
void pumpOn() {
  if (!pumping) {
    if (RELAY_ACTIVE_LOW)
      digitalWrite(PUMP, LOW);
    else
      digitalWrite(PUMP, HIGH);
    pumping = true;
    Serial.println("PUMP ON");
  }
}
void pumpOff() {
  if (RELAY_ACTIVE_LOW)
    digitalWrite(PUMP, HIGH);
  else
    digitalWrite(PUMP, LOW);
  pumping = false;
}
