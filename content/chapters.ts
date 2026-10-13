export type ChapterMeta = {
  id: string;
  number: number;
  title: string;
  side: "build" | "life" | "both";
};

export const chapters: ChapterMeta[] = [
  { id: "cover", number: 0, title: "Cover", side: "both" },
  { id: "day-job", number: 1, title: "Day job", side: "build" },
  { id: "camera", number: 2, title: "Behind the camera", side: "life" },
  { id: "projects", number: 3, title: "Side projects", side: "build" },
  { id: "bailey", number: 4, title: "Off the clock with Bailey", side: "life" },
  { id: "say-hi", number: 5, title: "Say hi", side: "both" },
];
