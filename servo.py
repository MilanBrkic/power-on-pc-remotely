import RPi.GPIO as GPIO
import sys
from time import sleep


def getDuty(angle):
    floatAngle = float(angle)
    return 2 + (floatAngle/18)

RETURN_TO_ANGLE = 90

try:
    try:
        arg = sys.argv[1]
    except IndexError:
        print("Error: No argument provided.")
        sys.exit(1)

    GPIO.setmode(GPIO.BOARD)
    GPIO.setup(11, GPIO.OUT)
    p = GPIO.PWM(11, 50)

    p.start(0)

    duty = getDuty(arg)
    p.ChangeDutyCycle(duty)
    sleep(1)

    returnToDuty = getDuty(RETURN_TO_ANGLE)
    
    p.ChangeDutyCycle(returnToDuty)
    sleep(1)
finally:
    p.stop()
    GPIO.cleanup()