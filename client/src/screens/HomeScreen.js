import { useEffect, useReducer } from 'react';
import axios from 'axios';
import logger from 'use-reducer-logger';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from '../components/Product';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Banner from '../banner/Banner';
import brandImgs from '../banner/BrandAPI';
import styled from 'styled-components';
// import data from '../data';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };

    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };

    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const Home = () => {
  const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {
    products: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }

      // setProducts(result.data);
    };
    fetchData();
  }, []);

  return (
    <>
      <div>
        <Helmet>
          <title>Trend-Bazaar</title>
        </Helmet>

        <Contain className="mx-2 mb-5 ">
          {brandImgs.map((item, index) => (
            <Wrap key={index}>
              <img src={item.imgSrc} alt={`banner${index}`} />
              <video
                autoPlay={true}
                loop={true}
                playsInline={false}
                muted={true}
              >
                <source src={item.videoSrc} type="video/mp4"></source>
              </video>
            </Wrap>
          ))}
        </Contain>
        <Banner />
      </div>
      <hr className="my-4" style={{ opacity: '0' }} />
      <div className="mx-5  mt-3">
        <h1>Featured Products</h1>
        <div className="products">
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <Row>
              {products.map((product) => (
                <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                  <Product product={product} />
                </Col>
              ))}
            </Row>
          )}
        </div>
      </div>
    </>
  );
};
const Contain = styled.div`
  display: grid;
  grid-gap: 25px;
  gap: 25px;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  @media screen and (min-width: 768px) and (max-width: 1200px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-gap: 15px;
    gap: 15px;
  }
  @media screen and (max-width: 767px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-gap: 11px;
    gap: 11px;
  }
`;

const Wrap = styled.div`
  margin-top: 31px;
  padding: 20px 0 16px;
  position: relative;
  padding-top: 40.25%;
  border-radius: 10px;
  cursor: default;
  overflow: hidden;
  box-shadow: rgb(0 0 0 /69%) 0px 26px 30px -10px,
    rgb(0 0 0 /73%) 0px 16px 10px -10px;
  transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
  object-position: center;
  border: 2px solid rgba(249, 249, 249, 0.1);
  img {
    inset: 0px;
    width: 100%;
    height: 100%;
    object-fit: contain;
    opacity: 1;
    z-index: 1500;
    display: block;
    border-radius: 20px;
    transition: opacity 500ms ease-in-out 0s;
    position: absolute;
    top: 0;
  }
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    z-index: 0;
    display: block;
    border-radius: 10px;
    position: absolute;
    top: 0;
  }
  &:hover {
    box-shadow: rgb(0 0 0 /80%) 0px 40px 58px -16px,
      rgb(0 0 0 /72%) 0px 30px 22x -10px;
    transform: scale(1.05);
    video {
      opacity: 1;
      z-index: 2000;
    }
  }
`;
export default Home;
