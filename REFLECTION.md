# Reflection

## Model Used
I used Cat Jam Free in OpenCode to build my website.

## Useful Prompt
"The website works, and I successfully tested adding a deadline.
Please add a visual indicator for deadlines that are overdue.
Keep the existing design and functionality.
Explain which files you changed and how I can verify the improvement.
Do not commit or push anything."

## Tool Action Observed
I observed OpenCode checking JavaScript syntax using
`node --check`. The check completed successfully.

## Improvement and Verification
Initially, overdue deadlines were not visually distinguished
from upcoming deadlines.

I asked OpenCode to add red highlighting for overdue deadlines.

I tested the website at localhost:8000 and confirmed that
overdue deadlines appeared in red while future deadlines
remained unchanged.

## How the Interaction Works
Users can enter an assignment name and select a due date.

After clicking "Add deadline", the deadline appears in the list.

The website uses JavaScript to manage deadlines and
localStorage to save them in the browser.

Deadlines with dates in the past are highlighted in red.
Users can also delete deadlines and add study notes.
