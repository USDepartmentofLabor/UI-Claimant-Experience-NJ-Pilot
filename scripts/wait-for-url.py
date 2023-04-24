#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import argparse
import requests
import time
import sys

parser = argparse.ArgumentParser()
parser.add_argument("--url", required=True)
parser.add_argument("--interval", type=int, default=5)
parser.add_argument("--max_attempts", type=int, default=12)
args = parser.parse_args()


def make_request(url):
    response = None
    try:
        response = requests.get(url)
    except requests.ConnectionError:
        return False
    if response is not None:
        print(f"Response code: {response.status_code}")
        return response.status_code == 200
    return False


def wait_for_url():
    url = args.url
    interval = args.interval
    max_attempts = args.max_attempts
    attempt = 1
    while attempt < max_attempts:
        print(f"Attempt: {attempt}")
        if make_request(url):
            print("Success")
            sys.exit(0)
        else:
            time.sleep(interval)
            attempt += 1
    print("Max attempts reached")
    sys.exit(1)


if __name__ == "__main__":
    wait_for_url()
