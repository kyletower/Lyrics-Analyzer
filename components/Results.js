import Image from 'next/image';

const Results = ({ geniusData }) => {
  return (
    <div>
      {geniusData &&
        geniusData.response.hits.map((hit, idx) => (
          <>
            {/* <Image
              key={idx}
              src='/pages/explicit.png'
              alt='explicit content'
              width={200}
              height={127}
            /> */}
            <p key={idx}>
              <span className='red-bold-small'>
                {hit.result.explicit ? 'E ' : ''}
              </span>
              {hit.result.full_title}
            </p>
          </>
        ))}
    </div>
  );
};

export default Results;
