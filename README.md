## Github API

This application can get HackYourFuture-CPH github repositories via ajax using JavaScript then process JSON data and push them into index.html page. Also it is the solution of a [Homework](https://github.com/HackYourFuture-CPH/JavaScript/blob/master/JavaScript2/Week6/homework.md)whick has been set by [HackYourFuture-CPH](https://github.com/HackYourFuture-CPH)


### HackYourFuture Repositories
![Show repositories](https://raw.githubusercontent.com/zuhairtaha/week6hw/master/src/img/js2w2-1.gif)
After _HackYourFuture Repositories_ button clicked, the repositories will be listed in the table.
These data comes from the link:
[https://api.github.com/orgs/HackYourFuture/repos](https://api.github.com/orgs/HackYourFuture/repos)

and table rows created, then filled and appended to the table.

### Amount of commits or contributers
As we can see the number of commits and contributers will be aslo added to the last table. these data will be created asynchronously by makeRequest callback function. An loading icons shows before the request complete.

### Search for a repositories
![search](https://raw.githubusercontent.com/zuhairtaha/week6hw/master/src/img/js2w2-2.gif)
User can search for any repository at HackYourFuture-CPH repositories by writing any text here and submit the form. Results will be displayed in the same way as before.

![error handling](https://raw.githubusercontent.com/zuhairtaha/week6hw/master/src/img/js2w2-3.gif)
If the user inter nothing or white spaces, a notification will say `You didn not enter a search term`. In addtion, if there is no results an alert will appear.

### Show commits
![Show commits](https://raw.githubusercontent.com/zuhairtaha/week6hw/master/src/img/js2w2-4.gif)
Click on any repository to see all commits after the table.

### Sorting options
![Sorting options](https://raw.githubusercontent.com/zuhairtaha/week6hw/master/src/img/js2w2-5.jpg)

The small list grouped button shows list. This list has several options for sorting the repositories

- The most forked repositories
- The least forked repositories
- The most watched repositories
- The least watched repositories

### Show total repositories
the last item at previous list it _The total number of forks for all repos_
![total](https://raw.githubusercontent.com/zuhairtaha/week6hw/master/src/img/js2w2-6.JPG)
