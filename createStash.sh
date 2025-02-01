#!/bin/bash

# Ask for stash message
echo "Enter a stash message: "
read stash_message

# Create a new stash
git stash save "$stash_message"

# Check if stash was created successfully
if [ $? -ne 0 ]; then
    echo "Error: Failed to create stash."
    exit 1
fi

# Ask for new branch name
echo "Enter new branch name: "
read branch_name

# Create and checkout new branch
git checkout -b "$branch_name"

# Check if branch was created successfully
if [ $? -ne 0 ]; then
    echo "Error: Failed to create new branch."
    git stash pop
    exit 1
fi

# Apply the stash to the new branch
git stash pop

# Check if stash was applied successfully
if [ $? -ne 0 ]; then
    echo "Error: Failed to apply stash to the new branch."
    exit 1
fi

echo "Stash applied to the new branch $branch_name successfully."

# Add changes to staging
git add .

# Commit changes with branch name as commit message
git commit -m "$branch_name"

# Set the upstream branch
git push --set-upstream origin "$branch_name"

# Check if push was successful
if [ $? -ne 0 ]; then
    echo "Error: Failed to push the branch to remote."
    exit 1
fi

echo "Branch $branch_name pushed successfully."
