import Image from 'next/image';

const LoadingSpinner = () => {
  return (
    <Image
      src='/images/spinner loading transparent.gif'
      alt='loading'
      width={160}
      height={120}
    />
  );
};

export default LoadingSpinner;
