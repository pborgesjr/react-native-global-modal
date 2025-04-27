# React Native Global Modal

A lightweight and flexible modal management system for React Native applications. This library provides a simple way to show modals from anywhere in your app using a provider pattern.

## Features

- Show modals from anywhere in your app
- Type-safe with TypeScript
- Customizable modal appearance
- Support for multiple modals
- Built on top of react-native-modal

## Installation

```bash
npm install react-native-global-modal react-native-modal
# or
yarn add react-native-global-modal react-native-modal
# or
pnpm add react-native-global-modal react-native-modal
```

## Usage

1. First, wrap your app with the `GlobalModalProvider`:

```tsx
import { GlobalModalProvider } from "react-native-global-modal";

function App() {
  return <GlobalModalProvider>{/* Your app content */}</GlobalModalProvider>;
}
```

2. Use the `openModal` and `closeModal` functions to control modals:

```tsx
import { openModal, closeModal } from "react-native-global-modal";

// Open a modal
openModal({
  id: "id#123",
  component: MyModalComponent,
  props: {
    title: "Hello World",
  },
});

// Close an avoidable modal
closeModal();

// Close an unnavoidable modal
closeModal("id#123");
```

## Package Reference

### `GlobalModalProvider` Props

| Prop                     | Type        | Default Value | Description                                                                                                                |
| ------------------------ | ----------- | ------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `children`               | `ReactNode` | **REQUIRED**  | Your app content                                                                                                           |
| `discardModalWithSameId` | `boolean?`  | `false`       | When true, if the user tries to open a modal if the same ID of the current visible modal, the next modal will be discarded |

### openModal Parameters

| Parameter       | Type        | Default Value | Description                                                                                                      |
| --------------- | ----------- | ------------- | ---------------------------------------------------------------------------------------------------------------- |
| `id`            | `string?`   | `undefined`   | Unique identifier for the modal                                                                                  |
| `children`      | `ReactNode` | **REQUIRED**  | The modal component to render                                                                                    |
| `unnavoidable`  | `boolean?`  | `false`       | When `true`, the modal will be displayed with priority over other modals and can only be closed providing the id |
| `skipAnimation` | `boolean?`  | `false`       | When `true`, the modal will not have animation when opening or closing                                           |

#### The following are some of the most commonly used props from `react-native-modal` that you can pass to `openModal`:

| Prop                          | Type         | Default Value    | Description                                     |
| ----------------------------- | ------------ | ---------------- | ----------------------------------------------- |
| `onBackdropPress`             | `function?`  | `undefined`      | Function called when the backdrop is pressed    |
| `onBackButtonPress`           | `function?`  | `undefined`      | Function called when the back button is pressed |
| `animationIn`                 | `string`     | `"slideInUp"`    | Animation type when modal opens                 |
| `animationOut`                | `string`     | `"slideOutDown"` | Animation type when modal closes                |
| `animationInTiming`           | `number`     | `200`            | Duration of the animation when modal opens      |
| `animationOutTiming`          | `number`     | `200`            | Duration of the animation when modal closes     |
| `backdropOpacity`             | `number`     | `0.5`            | Opacity of the backdrop                         |
| `backdropTransitionInTiming`  | `number`     | `300`            | Duration of the backdrop fade in animation      |
| `backdropTransitionOutTiming` | `number`     | `300`            | Duration of the backdrop fade out animation     |
| `useNativeDriver`             | `boolean`    | `true`           | Use native driver for animations                |
| `style`                       | `ViewStyle?` | `undefined`      | Style for the modal container                   |

For a complete list of available props, please refer to the [react-native-modal documentation](https://github.com/react-native-modal/react-native-modal#available-props).

### closeModal Parameters

| Parameter | Type      | Description                           |
| --------- | --------- | ------------------------------------- |
| `id`      | `string?` | ID of the unnavoidable modal to close |

## Under the Hood

### Modal Identification System

The library implements a modal identification system that works in two ways:

1. **Explicit IDs**: When you provide an `id` prop to `openModal`, it's used directly to identify the modal.
2. **Auto-generated IDs**: When no `id` is provided, the library automatically generates one by hashing the modal's properties.

This identification system is particularly useful when `discardModalWithSameId` is enabled in the `GlobalModalProvider`, as it prevents duplicate modals from being displayed.

### Unavoidable Modals

The `unnavoidable` prop introduces a special type of modal that:

- Can only be closed by explicitly providing its ID to the `closeModal` function
- Prevents other modals from being displayed while it's open
- Ensures critical modals (like error messages or important confirmations) can't be accidentally dismissed

Example of an unavoidable modal:

```tsx
openModal({
  id: "critical-error",
  unnavoidable: true,
  children: <>{...}</>,
});
```

### Modal Queue System

The library implements a queue system that:

1. Manages multiple modal requests
2. Handles modal transitions smoothly
3. Prevents modal conflicts
4. Supports modal prioritization through the `unnavoidable` prop

When a new modal is requested while another is open:

- If the current modal is `unnavoidable`, the new request is ignored
- If `discardModalWithSameId` is true and the IDs match, the new request is ignored
- Otherwise, the new modal is queued and will be shown after the current one closes

## Example

```tsx
import React from "react";
import { View, Button } from "react-native";
import { openModal, closeModal } from "react-native-global-modal";

const MyModal = ({ title, onClose }) => (
  <View>
    <Text>{title}</Text>
    <Button title="Close" onPress={onClose} />
  </View>
);

const MyScreen = () => {
  const handleOpenModal = () => {
    openModal({
      id: "example-modal",
      component: MyModal,
      props: {
        title: "Hello from modal!",
        onClose: () => closeModal("example-modal"),
      },
    });
  };

  return (
    <View>
      <Button title="Open Modal" onPress={handleOpenModal} />
    </View>
  );
};
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
