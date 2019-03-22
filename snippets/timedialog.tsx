import { TimeDialog, Button, StackComposite, TextView, contentView } from 'tabris';

contentView.append(
  <StackComposite layoutData='fill' padding={8} spacing={16} alignment='stretchX'>
    <Button onSelect={showSimpleDialog}>Simple time dialog</Button>
    <Button onSelect={showSpecificTime}>Dialog with pre-set time</Button>
    <TextView/>
  </StackComposite>
);

const textView =  contentView.find(TextView).first();

async function showSimpleDialog() {
  const {date} = await TimeDialog.open().onClose.promise();
  textView.text = date ? `Picked ${date.toTimeString()}` : 'Canceled';
}

async function showSpecificTime() {
  const {date} = await TimeDialog.open(new Date(1, 1, 1, 20, 15)).onClose.promise();
  textView.text = date ? `Picked ${date.toTimeString()}` : 'Canceled';
}