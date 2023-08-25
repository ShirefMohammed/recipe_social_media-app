/* eslint-disable react/prop-types */
import { useContext } from "react";
import { ProfileContext } from "../UserProfile";
import { RotatingLines } from "react-loader-spinner";
import { UserCard } from "../../../components";
import style from "./Connections.module.css";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const Connections = ({ users, setLimit, fetchLoading }) => {
  const { range } = useContext(ProfileContext);

  return (
    <>
      {
        users.length > 0 ?
          <Swiper className={style.swiper}
            modules={[Navigation]}
            navigation={true}
            slidesPerView={1}
            spaceBetween={15}
            slidesPerGroup={1}
            loop={false}
          >
            {
              users.map(user =>
                user._id ?
                  <SwiperSlide key={user._id}>
                    <UserCard user={user} />
                  </SwiperSlide>
                  : ""
              )
            }

            <SwiperSlide className={style.load_more}>
              <button
                disabled={fetchLoading}
                style={fetchLoading ? { opacity: ".5", cursor: "revert" } : {}}
                onClick={() => setLimit(prev => prev + range)}
              >
                {
                  fetchLoading &&
                  <RotatingLines
                    strokeColor="gray"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="15"
                    visible={true}
                  />
                }
                load more
              </button>
            </SwiperSlide>
          </Swiper>

          : <p className={style.no_connections}>
            No connections here
          </p>
      }
    </>
  )
}

export default Connections
