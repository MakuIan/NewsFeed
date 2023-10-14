import { useGetTopStoriesQuery } from "../../fetch/TopStories/topStoriesService";
import { isObjectInSet } from "../../general methods/ObjectProperties";
import shuffleArray from "../../general methods/shuffleArray";
import TopStoriesSwiper from "./TopStoriesSwiper";
import ErrorBoundary from "../ErrorBoundary";

import {
  TopStoriesEnParams,
  TopStoriesEnResponse,
} from "../../fetch/TopStories/topStoriesTypes";

type SectionData = {
  [section in TopStoriesEnParams]?: {
    isLoading: boolean;
    data?: TopStoriesEnResponse[];
  };
};

const TopStoriesEn = () => {
  const sectionNames: TopStoriesEnParams[] = [
    "business",
    "politics",
    "us",
    "fashion",
  ];

  const sectionData: SectionData = {};
  let delayCounter = 0;
  // Fetch data for each section
  sectionNames.forEach(async (section) => {
    //Delay for NYT API Request Limit
    if (delayCounter > 2) {
      delayCounter = 0;
      await new Promise((resolve) => setTimeout(resolve, 12000));
    }
    const { isLoading, data } = useGetTopStoriesQuery(section);
    sectionData[section] = { isLoading, data };
    delayCounter++;
  });

  const isLoadingFlags = sectionNames.map((section) => {
    const { isLoading } = sectionData[section] || {}; // Assuming sectionData holds loading state
    return isLoading;
  });

  if (isLoadingFlags.some((flag) => flag)) {
    return <h1>Loading...</h1>;
  }
  // Combine data from all sections
  const combinedArray: TopStoriesEnResponse[] = [];

  for (const section in sectionData) {
    const data = sectionData[section as TopStoriesEnParams]?.data ?? [];
    combinedArray.push(...data.slice(0, 5));
  }
  const combinedSet = new Set(combinedArray);
  //check for duplicates in the set
  for (const obj of combinedArray) {
    if (!isObjectInSet(combinedSet, obj)) {
      combinedArray.push(obj);
    }
  }
  // Shuffle the array
  const shuffledArray = shuffleArray(combinedArray);
  const filteredArray = shuffledArray.filter((obj) => {
    // Include objects that have a 'multimedia' property that is not null (images)
    // and 'section' property not equal to 'admin'

    return (obj.multimedia !== null && obj.section !== "admin") || obj === null;
  });

  return <TopStoriesSwiper data={filteredArray} />;
};
function TopStoriesEnErrorBoundary() {
  return (
    <ErrorBoundary
      errorComponent={<h1>Something went wrong with TopStoriesDE</h1>}
    >
      <TopStoriesEn />
    </ErrorBoundary>
  );
}
export default TopStoriesEnErrorBoundary;
