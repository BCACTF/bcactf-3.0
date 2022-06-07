# Three Step Trivia (Webex, 100 points)
The first step says that decimals are required, but we aren't allowed to input them. We can get around this by changing the input type from `number` to `text`.
```html
<input type="number" name="answer" />
```

```html
<input type="text" name="answer" />
```

Now we are allowed to put in a decimal number and proceed to the second step.


Here, there is no input box. However, if you noticed from the first step, the url changed to the answer, and we were redircted to `/7_75`. To proceed to the third step, we can simply change the URL to the second step's answer, which is 11674, `web.bcactf.com:49207/11674`.


At the third step, the input box is visible but the submit button is not. Pressing enter does not do anything either. If we go to the inspector, we can see the submit button has a CSS style of
```css
visibility: hidden
```
We can change it to be visible to reveal the button and then press it to get the flag.
```html
<button type="submit" class="btn" style="visibility: visible;">Submit</button>
```