import {
  useGetAllNewsQuery,
  useGetDeNewsQuery,
} from "../../fetch/tagesschauNewsService";
import shuffleArray from "../../general methods/shuffleArray";
import splitArrayIntoChunks from "../../general methods/splitArrayIntoChunks";
import { useContext } from "react";
import Page from "./Context/Page";
import News from "./News";
import NextPage from "./NextPage";
import NewsQuery from "./Context/NewsQuery";
import { useSelector } from "react-redux";

const ResultsDe = () => {
  const [q, setQ] = useContext(NewsQuery);
  const [page, setPage] = useContext(Page);
  const { isLoading: isLoadingAll, data: dataAll } = useGetAllNewsQuery();
  const { isLoading: isLoadingSearch, data: dataSearch } = useGetDeNewsQuery({
    q: q,
    page: page,
  });
  if (isLoadingAll) {
    return <div>Loading...</div>;
  }
  if (isLoadingSearch) {
    return <div>Loading...</div>;
  }
  let data = [];
  if (!q) {
    const { news, regional } = dataAll;
    const mixedArray = [];

    for (const item of news.concat(regional)) {
      //Check for duplicates
      if (
        !mixedArray.some(
          (existingItem) => existingItem.sophoraId === item.sophoraId,
        )
      ) {
        mixedArray.push(item);
      }
    }
    const shuffledArray = shuffleArray(mixedArray);
    const chunkedArray = splitArrayIntoChunks(shuffledArray, 10);

    if (page > 4) {
      return <h1>Keine weiteren Nachrichten</h1>;
    } else {
      data = chunkedArray[page - 1];
    }
  } else {
    data = dataSearch;
    console.log("dataSearch", data);
  }
  return (
    <div>
      {!data.length ? null : (
        <div>
          {data.map((news) => {
            console.log("news", news);
            const {
              title,
              teaserImage,
              detailsweb: url,
              sophoraId: id,
              firstSentence: description,
            } = news;

            const imageUrl = teaserImage?.imageVariants["16x9-1920"] ?? null;
            const props = {
              title: title,
              description: description,
              url: url,
              imageUrl: imageUrl,
              name: "Tagesschau",
              author: "",
              language: "de",
            };
            return (
              <div key={id}>
                <News {...props} />
              </div>
            );
          })}
          <NextPage />
        </div>
      )}
    </div>
  );
};
export default ResultsDe;
