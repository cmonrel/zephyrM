import { Text } from "react-native";

interface CalendarEventProps {
  event: {
    title: string;
    user: {
      name: string;
    };
  };
}

export default function CalendarEvent({ event }: CalendarEventProps) {
  const { title, user } = event;

  return (
    <Text>
      {title} - {user.name}
    </Text>
  );
}
