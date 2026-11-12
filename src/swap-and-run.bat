@echo off
if not exist "main.js" (
    echo Error: main.js not found
    exit /b 1
)
if not exist "_main.js" (
    echo Error: _main.js not found
    exit /b 1
)

ren "main.js" "temp_swap.js"
ren "_main.js" "main.js"
ren "temp_swap.js" "_main.js"

echo Files swapped successfully!

if exist "app.elf" (
    echo Opening app.elf...
    start "" "app.elf"
) else (
    echo Warning: app.elf not found
)