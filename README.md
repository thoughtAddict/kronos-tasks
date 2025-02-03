# Kronos Tasks

At work we send morning task priority emails, followed by updates for those same tasks at the end of the day.

While prepping these two emails, (one in the morning and one at the end of the day), I noticed that putting together a concise, yet informational, email was taking longer than I wanted.

This and the email app that we use isn't the best when it comes to the copy/paste of previous tasks and updates. Skewed bullet lists and incorrectly indented sub-items take time for me to (constantly) fix.

So with that, I decided to create the <em>Kronos Tasks</em> page that you're viewing now.

## No External Dependencies or Frameworks

It's a single file that uses Javascript, HTML, and CSS (Tailwind).

It'll help create task lists that can then be copy/pasted into whatever email app, or document, you use for your task updates.

## Tailwind

If you wanted to checkout and alter the CSS for your own needs, I'm using Tailwind v3.4.17, along with the command:

```
npx tailwindcss -i ./src/input.css -o ./src/style.css
```

## Road Map

- Find a better method to use for "Copy to Clipboard"
- Save tasks to LocalStorage
- Provide way to clear LocalStorage
- Import / Export of Tasks

## License

MIT
