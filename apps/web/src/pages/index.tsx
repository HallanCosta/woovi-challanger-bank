import { GetServerSideProps } from 'next';
import { AuthApp } from '../components/Auth/AuthApp';

const Index = () => {
  return <AuthApp />;
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

export default Index;
