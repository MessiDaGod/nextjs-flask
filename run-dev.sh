#!/bin/bash
source venv/bin/activate
pip3 install -r requirements.txt
python3 -m flask --app api/index run -p 5328
