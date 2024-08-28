import {useEffect, useRef, useState} from "react";
import {request} from "../utils.js";
import {useNavigate} from "react-router-dom";
import Modal from "../modal.jsx";

const carriers = ['济南移动']

export default function Goods() {
  const navigate = useNavigate();
  const formRef = useRef(null)

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalButtonText, setModalButtonText] = useState("关闭");
  const [modalOptionalButton, setModalOptionalButton] = useState();

  return (<>
    <div className="container mx-auto max-w-[750px]">

      <div
        className="fixed mt-[620px] inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
        aria-hidden="true">
        <div
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          style={{clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"}}>
        </div>
      </div>

      <div className="image-container relative mb-[20px] bg-no-repeat w-full">
        <img className="object-cover object-bottom w-full h-[calc(100%-2px)] absolute left-0 top-0 z-[-10]"
             src="/assets/banner-compressed.png"/>
        <img className="object-cover w-full h-[calc(100%-4px)]"
             src="/assets/index-bg-mask.svg"/>
        <img className="object-cover translate-x-[-50%] h-[41.58%] absolute left-[50%] bottom-[12.3%] z-10"
             src="/assets/index-avatar-circle.svg"/>
        <img className="object-cover translate-x-[-50%] h-[36.82%] absolute left-[50%] bottom-[15.5%] z-20"
             src="/assets/qlu-logo-space.png"/>
        {/*<img*/}
        {/*  className="object-cover translate-x-[-50%] translate-y-[3px] absolute bottom-[3.11%] left-[50%] h-[27px] md:h-[36px]"*/}
        {/*  src="images/index-title.svg"/>*/}
        <div
          className="object-cover translate-x-[-50%] translate-y-[20px] absolute bottom-[3.11%] left-[50%] h-[27px] md:h-[36px] text-nowrap text-2xl flex flex-col justify-center items-center text-qlu font-bold">
          <div>齐鲁工业大学</div>
          <div>校园网套餐开通</div>
        </div>
      </div>

      {/*<div*/}
      {/*  className="border rounded-lg border-gray-400/50 bg-white/30 backdrop-blur px-4 py-4 mx-4 mt-16 text-gray-700">*/}
      {/*  <div className="text-xl underline underline-offset-8 decoration-pink-500 decoration-2 font-medium py-2">*/}
      {/*    绑定提示*/}
      {/*  </div>*/}
      {/*  <div className="pt-2">*/}
      {/*    本页面仅供移动融套餐用户进行校园网账号绑定，其他用户绑定后将导致无法连接校园网！*/}
      {/*  </div>*/}
      {/*</div>*/}

      <ol className="divide-y-2 border-gray-600 mt-16">
        <li><GoodCard title="2024 新生特惠" content="100Mbps 速率，仅限 2024 入学本科生/研究生选购。" price="9"/></li>
        <li><GoodCard title="100Mbps 套餐" content="200Mbps 速率对等网络，四网优选出口。" price="19"/></li>
        <li><GoodCard title="1000Mbps 套餐" content="1000Mbps 速率对等网络，四网优选出口。" price="49"/></li>
      </ol>
    </div>

    <div
      className="w-full sticky bottom-0 bg-white/50 backdrop-blur mt-16 py-4 flex flex-col justify-center items-center text-sm text-gray-600 bg-white">
      <div className="mb-1">&copy;2024 齐鲁工业大学 | 网络信息中心</div>
      <div className="leading-4">故障上报：关注“齐鲁工业大学网络运维”微信公众号</div>
      <div className="leading-4">选择“网络运维”-“网络报修”</div>
    </div>

    <Modal isOpen={showModal} setIsOpen={setShowModal} buttonText={modalButtonText}
           optionalButton={modalOptionalButton}>
      {modalContent}
    </Modal>
  </>)
}

function GoodCard({title, content, price}) {
  return (<>
    <div className="m-4 flex ">
      <div className="w-24 md:w-32 h-24 md:h-32 min-w-24 md:min-w-32 max-w-24 lg:max-w-32 rounded-xl shadow p-2">
        <img src="/assets/wlyw-logo-space.png" className=""/>
      </div>
      <div className="flex flex-col ml-4 flex-grow py-2">
        <div className="text-lg font-bold">{title}</div>
        <div className="flex flex-col justify-between flex-grow">
          <div>{content}</div>
          <div className="flex justify-between items-center gap-x-4">
            <div className="text-qlu">￥ {price}</div>
            <div className="px-4 py-2 bg-qlu text-white rounded text-sm select-none cursor-pointer"
                 onClick={() => {
                   // setShowModal(true)
                   alert('暂未开放')
                 }}
            >
              立即购买
            </div>
          </div>
        </div>
      </div>
    </div>
  </>)
}
