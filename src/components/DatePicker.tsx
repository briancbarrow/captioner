import { useDatePicker } from "react-aria";
import { useDatePickerState } from "react-stately";

// Reuse the DateField, Popover, Dialog, Calendar, and Button from your component library.
import {
  Button,
  Calendar,
  DateField,
  Dialog,
  Popover,
} from "your-component-library";

function DatePicker(props) {
  let state = useDatePickerState(props);
  let ref = React.useRef(null);
  let {
    groupProps,
    labelProps,
    fieldProps,
    buttonProps,
    dialogProps,
    calendarProps,
  } = useDatePicker(props, state, ref);

  return (
    <div style={{ display: "inline-flex", flexDirection: "column" }}>
      <div {...labelProps}>{props.label}</div>
      <div {...groupProps} ref={ref} style={{ display: "flex" }}>
        <DateField {...fieldProps} />
        <Button {...buttonProps}>🗓</Button>
      </div>
      {state.isOpen && (
        <Popover state={state} triggerRef={ref} placement="bottom start">
          <Dialog {...dialogProps}>
            <Calendar {...calendarProps} />
          </Dialog>
        </Popover>
      )}
    </div>
  );
}

<DatePicker label="Event date" />;
