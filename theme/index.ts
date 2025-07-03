export const theme = {
  background: '#eab308',
  text: '#eab308',
} as const;

export const styles = {
  text: { color: theme.text },
  background: { backgroundColor: theme.background },
};