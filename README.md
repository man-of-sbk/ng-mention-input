# Ng-Mention-Input

`ng-mention-input` is a simple library helping you to create mention inputs receiving arrays which could arbitrarily contain any forms of data and emit the exact property you need from the arrays' properties.

## Installation
Add the package to a project of yours:

```shell
npm install --save ng-mention-input
```

Add the module to your `app.module`:

```js
import { MentionModule } from 'ng-mention-input';
...

@NgModule({
  imports: [ MentionModule ],
  ...
})
```

## Configuration Options
| Option                      | Default | Description |
| ---                         | ---     | ---         |
| mentionList                 | []      | An array of arbitrary value used as an initiative data used to generate the input |
| areMentionItemsObjects      | false   | Determine whether or not the `mentionList` is an array of objects |
| displayedValueQuery         |         | An object property query, necessary to pick a property of objects out of the `mentionList` array to display it to the found-item badge |
| retrievedValueQuery         |         | An object property query, necessary to pick a property of objects out of the `mentionList` array to emit |
| deleteByRetrievedValueQuery |         | An object property query, used to delete an item which has matched given-property | 
|value                        | []      | default value of the input |
