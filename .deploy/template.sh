#!/bin/bash

function template {
    sed 's?{{IMAGE}}?'"$IMAGE_NAME:$IMAGE_TAG"'?g' --in-place "$1"
}
