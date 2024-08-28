import {useEffect, useState} from "react";
import {getLoginInfo, request} from "../utils.js";
import {useNavigate} from "react-router-dom";
import Modal from "../modal.jsx";

export default function AllocateClass() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [idCard, setIdCard] = useState('');
  const [token, setToken] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalButtonText, setModalButtonText] = useState("关闭");
  const [modalOptionalButton, setModalOptionalButton] = useState();

  const [userInformation, setUserInformation] = useState({});

  // 检查是否已登录
  useEffect(() => {
    getLoginInfo().then(res => {
      if (!res.status) {
        console.error('allocate-class: getLoginInfo fail.')
        navigate('/');
      } else {
        let {name, idCard, token} = res
        setName(name)
        setIdCard(idCard)
        setToken(token)

        // 获取分班信息
        request({
          url: '/api/user_information',
          method: 'GET',
          params: {name, id_card: idCard, token},
        }).then(res => {
          console.log(res)
          if (res.status !== 'success') {
            setShowModal(true)
            setModalContent(`查询失败：${res.message}`)
            return;
          }
          setUserInformation(res)
        })
      }
    })
  }, []);

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
          <div className="font-serif">齐鲁工业大学</div>
          <div className="font-serif">新生分班信息表</div>
        </div>
      </div>

      <div className="p-4 pb-12 mb-12">
        <table className="mt-10 w-full">
          <tbody className="w-full">
          <tr className="w-full">
            <th className="border-y border-gray-300 text-nowrap whitespace-nowrap sm:px-12 px-3 py-2" scope="row">姓名
            </th>
            <td className="border-y border-gray-300 w-full">{userInformation.name}</td>
          </tr>
          <tr className="w-full">
            <th className="border-b border-gray-300 text-nowrap whitespace-nowrap sm:px-12 px-3 py-2" scope="row">学号
            </th>
            <td className="border-b border-gray-300 w-full">{userInformation.student_id}</td>
          </tr>
          <tr className="w-full">
            <th className="border-b border-gray-300 text-nowrap whitespace-nowrap sm:px-12 px-3 py-2"
                scope="row">学部（院）
            </th>
            <td className="border-b border-gray-300 w-full">{userInformation.department}</td>
          </tr>
          <tr className="w-full">
            <th className="border-b border-gray-300 text-nowrap whitespace-nowrap sm:px-12 px-3 py-2" scope="row">专业
            </th>
            <td className="border-b border-gray-300 w-full">{userInformation.major}</td>
          </tr>
          <tr className="w-full">
            <th className="border-y border-gray-300 text-nowrap whitespace-nowrap sm:px-12 px-3 py-2" scope="row">班级
            </th>
            <td className="border-y border-gray-300 w-full">{userInformation.class}</td>
          </tr>
          </tbody>
        </table>
      </div>

    </div>

    <div
      className="w-full sticky bottom-0 bg-white/50 backdrop-blur mt-16 py-4 flex flex-col justify-center items-center text-sm text-gray-600 bg-white">
      <div>&copy;2024 齐鲁工业大学 | 网络信息中心</div>
      <div>联系方式：<a href="tel:0531-89631358">0531-89631358</a></div>
    </div>

    <Modal isOpen={showModal} setIsOpen={setShowModal} buttonText={modalButtonText}
           optionalButton={modalOptionalButton}>
      {modalContent}
    </Modal>
  </>)
}
