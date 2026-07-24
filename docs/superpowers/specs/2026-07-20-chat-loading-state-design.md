# Chat Loading State Design

## Goal
Replace the static pulsing dots in the `ChatCommandPalette` with a friendly, conversational loading state that cycles through text phrases while waiting for the assistant's response.

## Architecture & Components
- **New Component**: A local component named `ThinkingIndicator` will be added directly into `ChatCommandPalette.tsx` to keep the file self-contained since this is a highly specific UI element.
- **State**: It will maintain a `phraseIndex` state (number).
- **Behavior**: A `useEffect` hook will set up an interval of `2000ms`. Every 2 seconds, `phraseIndex` will increment (wrapping around using modulo logic) to show the next phrase.
- **Phrases**: 
  - "Thinking..."
  - "Searching memory..."
  - "Formulating response..."
  - "Almost there..."

## UI & Styling
- The text will be styled with `text-sm text-zinc-500 italic`.
- A subtle fade animation will be applied to the text wrapper (using `animate-in fade-in slide-in-from-bottom-1 duration-300`) tied to a `key` prop that changes when the phrase changes, ensuring a smooth transition.
- A single pulsing dot (`animate-pulse bg-accent/50`) will be placed alongside the text for continuity with the old design.

## Data Flow
- `ChatCommandPalette` observes `m.content`. When it is empty (and `status === "streaming"` or `messages` exist), the `ThinkingIndicator` is rendered.
- The `ThinkingIndicator` requires no props.

## Testing & Verification
- Open the Chat Command Palette and submit a query.
- Observe the loading state before the text streams in.
- Verify that it transitions between phrases cleanly without UI jumping.
