import styles from '../styles/Home.module.css';
import { useState } from 'react';
import Search from '../components/Search';
import Results from '../components/Results';

export default function Home() {
  const [geniusData, setGeniusData] = useState('');

  return (
    <div className={styles.container}>
      <Search setGeniusData={setGeniusData} />
      <Results geniusData={geniusData} />
    </div>
  );
}
