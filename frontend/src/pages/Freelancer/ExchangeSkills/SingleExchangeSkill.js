import RatingStars from "../DashBoard/PagesComponent/Helpers/RatingStars";

const SingleExchangeSkill = ({ data, reviews }) => {
  const {
    requiredSkills,
    offeredSkills,
    price,
    duration,
    freelancer,
    discription,
    title,
    tags,
    createdAt,
  } = data;

  const dateConverter = (createdAt) => {
    const userCreatedDate = new Date(createdAt);
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var month = months[userCreatedDate.getMonth()];
    var year = userCreatedDate.getFullYear();
    var date = userCreatedDate.getDate();

    return `${month} ${date} ${year} `;
  };

  const filteredReviews = reviews?.filter(
    (review) => review?.freelancer?._id === freelancer?._id
  );

  const calculateAverage = (reviews) => {
    let average = 0;

    if (reviews && reviews?.length > 0) {
      const total = reviews?.reduce((acc, rating) => {
        if (rating && rating.Ratings) {
          return acc + rating.Ratings;
        }
        return acc;
      }, 0);
      average = total / reviews.length;
    }

    return average;
  };

  const average = calculateAverage(filteredReviews);

  const limitText = (text, char) => {
    return text && text.split(" ").slice(0, char).join(" ");
  };

  return (
    <div className="h-full pb-16 overflow-y-auto">
      <div className="container  mx-auto grid">
        {/* Exchange Skill */}

        <div className=" mt-2 bg-white rounded-lg shadow-md  border border-3 -mb-12 ">
          <div className="flex flex-col flex-wrap space-y-2  p-3">
            <div>
              <h3 className=" text-xl font-semibold text-gray-700 ">{title}</h3>
            </div>
            <div className="flex flex-row items-center  flex-wrap space-x-2 text-sm text-gray-500">
              <div className="flex flex-row flex-wrap space-x-1">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mt-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>{dateConverter(createdAt)}</div>
              </div>
              <div className="flex flex-row flex-wrap space-x-1">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mt-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>{freelancer?.address?.country}</div>
              </div>
            </div>
            <div className="flex flex-row flex-wrap space-x-2">
              <div>
                <div className="flex items-center justify-around px-2 py-1 text-sm font-thin text-gray-700 bg-gray-300  rounded-md ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2 -ml-1 mt-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <span>Exchange Duration: {duration} days</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-around px-2 py-1 -ml-2 sm:ml-0 mt-2 sm:mt-0 text-sm font-thin text-gray-600 bg-gray-300  rounded-md ">
                  <svg
                    className="w-4 h-4 mr-2 -ml-1 mt-1"
                    fill="currentColor"
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                  >
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Beginner Price: ${price.beginnerLevel}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-around px-2 py-1 -ml-2 sm:ml-0 mt-2 sm:mt-0 text-sm font-thin text-gray-600 bg-gray-300  rounded-md ">
                  <svg
                    className="w-4 h-4 mr-2 -ml-1 mt-1"
                    fill="currentColor"
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                  >
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Intermediate Price: ${price.intermediate}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-around px-2 py-1 -ml-2 sm:ml-0 mt-2 sm:mt-0 text-sm font-thin text-gray-600 bg-gray-300  rounded-md ">
                  <svg
                    className="w-4 h-4 mr-2 -ml-1 mt-1"
                    fill="currentColor"
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                  >
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Expert Price: ${price.expert}</span>
                </div>
              </div>
            </div>
            <div>
              <p className="font-medium text-gray-700 my-2">
                {limitText(discription, 8)}..
              </p>
            </div>

            <div>
              <div className="flex flex-row flex-wrap space-x-2 w-full ">
                {tags?.map((tag, index) => (
                  <div
                    key={index}
                    className=" px-3 py-1 text-sm font-thin text-white bg-teal-600  rounded-md "
                  >
                    <span>{tag}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex flex-row flex-wrap space-x-2 w-full ">
                <div className=" px-3 py-1 text-sm font-thin text-white bg-cyan-600  rounded-md ">
                  <span>Required Skill: {requiredSkills}</span>
                </div>
                <div className="px-3 py-1 text-sm font-thin text-white bg-cyan-600  rounded-md">
                  <span>Offered Skill: {offeredSkills}</span>
                </div>
              </div>
            </div>
            <div>
              <div className="flex flex-row flex-wrap space-x-2">
                <div>
                  <div className="flex items-center justify-around px-2 py-1 text-sm font-semibold text-sky-500 ">
                    {freelancer?.verified ? (
                      <>
                        <svg
                          className="w-4 h-4 -ml-3 "
                          fill="#0ea5e9"
                          aria-hidden="true"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-700">
                          Freelancer Verified
                        </span>
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="black"
                          viewBox="0 0 20 20"
                          strokeWidth="1.5"
                          stroke="white"
                          className="w-4 h-4 -ml-3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-gray-700 ml-1">
                          Freelancer Not Verified
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <RatingStars
                  rating={average ? average : 0}
                  color="text-yellow-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleExchangeSkill;
