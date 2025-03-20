import requests 
import time 
import random

def send_message():
    message = random.choice(["Hello", "How are you?", "Is this working?"])
    response = requests.post('http://localhost/submit_contact.php', json={'message': message})
    print(repsonse.json())

while True:
    send_message()
    time.sleep(5)

