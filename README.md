[![Build Status](https://travis-ci.org/elkeis/angular-stick-to.svg?branch=master)](https://travis-ci.org/elkeis/angular-stick-to)
[![Coverage Status](https://coveralls.io/repos/elkeis/angular-stick-to/badge.svg?branch=master&service=github)](https://coveralls.io/github/elkeis/angular-stick-to?branch=master)
angular-stick-to components
======================

This is a set of angular directives that allows you to add a sticky behavior on your site. (trigger)

## angular-stick-to directive

The main guy that implements sticky behavior for given element.

### Usage

``` html
<div angular-stick-to="0">
  <!--Your awesome content here  -->
</div>
```
This code will make your element _"fixed"_ when it's top offset relatively to viewport top will be less or equal than `0`;

### Attributes

  Name                  | Type            | Description
 -----------------------|-----------------|----------------------
  angular-stick-to(required) | number          | Top offset relatively to viewport top. Limit, after that element becomes sticky.
                        | string          | Name of the `another sticky element`. It's bottom line will become the limit.
  name                  | string          | Name of current element
  limit                 | string          | Name of the `limit` element
  breakpoint            | number          | minimal width of the screen when directive will apply sticky behaviour

## angular-stick-to-limit

Limit element for sticky element.

### Usage

``` html
<div angular-stick-to="0">
  <!--  Your awesome content here -->
</div>
<!--  More awesome content -->
<div angular-stick-to-limit="your-sticky-limit-name">
  <!-- ... -->
</div>
```
Sticky element will become static if limit is reached.

Technical Details
==================
## Element possible positions
I will use the names of this cases in tests, so this is some explanation of them.
### Case1

```
-------------------------PrimaryLimit-----

  |'''''''''''''''''|
  |   Sticky        |
  |       Element   |
  '''''''''''''''''''





------------------------SecondaryLimit------
```
This is default position of our element, we do not need to do something with it

### Case2

```
.
  |'''''''''''''''''|
-------------------------PrimaryLimit-----
  |   Sticky        |
  |       Element   |
  '''''''''''''''''''






------------------------SecondaryLimit------
```
In this case our element should become sticky, because it's top edge is above it's top limit. It means that we should apply some styles.

### Case3
```
.
-------------------------PrimaryLimit-----


|'''''''''''''''''|
|   Sticky        |
------------------------SecondaryLimit------
|       Element   |
'''''''''''''''''''
```
Looks unbelievable, but it can happens on bad designed markups. like
```html
<div class="column1">
  <div angular-stick-to="0" limit="bad_guy">
    <!-- content -->
  </div>
</div>
<div class="column2">
  <!-- content -->
  <div angular-stick-to-limit="bad_guy">

  </div>
</div>
```
So technically this limit element will not cross the stick-to element, but will be
in the separated column. So **limit line** can cross our guy.
The secondary limit can't be applied on the element if the primary limit is not activated.
So we are just waiting for primary limit will be crossed during scroll and BOOM!!!! Big jump!

### Case4

```
.
|'''''''''''''''''|
-------------------------PrimaryLimit-----
|   Sticky        |
|       Element   |
------------------------SecondaryLimit------
'''''''''''''''''''
```
In this Case we are in conflicted situation. Top of our element is above top limit, but also its bottom is under the bottom limit. So here we should prioritize the limits. And the winner is ...

**BOTTOM LIMIT !!!** _(Hurray!!! Clap Clap Clap!!!)_  

So we need to apply such styles that will stick it's bottom edge to the bottom limit.


### Case5
```
.
|'''''''''''''''''|
|                 |
|                 |
-------------------------PrimaryLimit-----
|   Sticky        |
|       Element   |
'''''''''''''''''''

------------------------SecondaryLimit------
```
In this case we should stick it to the Secondary limit. Because primaryLimit - top gap is to big.
