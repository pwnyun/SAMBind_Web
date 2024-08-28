import {useEffect, useRef, useState} from "react";
import {request} from "../utils.js";
import {useNavigate} from "react-router-dom";
import Modal from "../modal.jsx";

const carriers = ['济南移动']

export default function SAMBind() {
  const navigate = useNavigate();
  const formRef = useRef(null)

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalButtonText, setModalButtonText] = useState("关闭");
  const [modalOptionalButton, setModalOptionalButton] = useState();

  const [countdown, setCountdown] = useState(0);

  // 倒计时逻辑
  useEffect(() => {
    if (countdown <= 0)
      return

    const interval = setInterval(() => setCountdown(countdown - 1), 1000)

    return () => window.clearInterval(interval)
  }, [countdown]);

  const sendCode = () => {
    if (countdown > 0)
      return

    let formData = new FormData(formRef.current);
    console.debug(formData)
    let studentNumber = formData.get('student_id');
    let phone = formData.get('phone_number')

    if (!studentNumber || isNaN(Number(studentNumber.trim())) || studentNumber.trim().length < 6 || studentNumber.trim().length > 12) {
      setShowModal(true)
      setModalContent('请先输入学/工号。')
      return
    }

    if (!phone || isNaN(Number(phone.trim())) || phone.trim().length !== 11 || !phone.trim().startsWith('1')) {
      setShowModal(true)
      setModalContent('输入的手机号码无效。')
      return
    }

    formData.delete('carrier')
    formData.delete('code')

    request({
      url: '/api/send_code',
      method: 'POST',
      data: formData
    }).then(res => {
      if (res.status !== 'success') {
        setShowModal(true)
        setModalContent(res.message);
      } else {
        setCountdown(60)
      }
    })

  }

  const submit = () => {
    let formData = new FormData(formRef.current);
    console.debug(formData)
    let studentNumber = formData.get('student_id');
    let carrier = formData.get('carrier');
    let phone = formData.get('phone_number')
    let code = formData.get('code');

    let error = ''

    if (!studentNumber || isNaN(Number(studentNumber.trim())) || studentNumber.trim().length < 6 || studentNumber.trim().length > 12)
      error += '请检查输入的学号；'

    if (!carrier || carriers.findIndex(item => item === carrier) === -1)
      error += '请选择运营商；'

    if (!phone || isNaN(Number(phone.trim())) || phone.trim().length !== 11 || !phone.trim().startsWith('1'))
      error += '输入的手机号码无效；'

    if (!code || isNaN(Number(code.trim())) || code.trim().length !== 4)
      error += '输入的验证码格式无效；'

    if (error) {
      setShowModal(true)
      setModalContent(error + '请检查输入。')
      return
    }

    request({
      url: '/api/bind',
      method: 'POST',
      data: formData
    }).then(res => {
      setShowModal(true)
      setModalContent(res.message);
    })
  }

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
            <div>校园网账号绑定</div>
          </div>
        </div>

        <div
          className="border rounded-lg border-gray-400/50 bg-white/30 backdrop-blur px-4 py-4 mx-4 mt-16 text-gray-700">
          <div className="text-xl underline underline-offset-8 decoration-pink-500 decoration-2 font-medium py-2">
            绑定提示
          </div>
          <div className="pt-2">
            本页面仅供移动融套餐用户进行校园网账号绑定，其他用户绑定后将导致无法连接校园网！
          </div>
        </div>

        <form ref={formRef} onSubmit={(e) => e.preventDefault()}>

          <div className="border-b border-gray-900/10 p-4 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-12">

              <div className="sm:col-span-6">
                <label htmlFor="student_id" className="block text-sm font-medium leading-6">
                  学号
                </label>
                <div className="mt-2 w-full">
                  <input
                    type="text"
                    name="student_id"
                    id="student_id"
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 backdrop-blur ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/*占位*/}
              <div className="hidden sm:block sm:col-span-6"></div>

              <div className="sm:col-span-6">
                <label htmlFor="carrier" className="block text-sm font-medium leading-6">
                  运营商
                </label>
                <div className="mt-2 w-full">
                  <select
                    id="carrier"
                    name="carrier"
                    defaultValue=""
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 ring-1 ring-inset ring-gray-300  focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm sm:leading-6"
                  >
                    <option value="" disabled hidden></option>
                    {carriers.map(item => <option key={item}>{item}</option>)}
                  </select>
                </div>
              </div>

              {/*占位*/}
              <div className="hidden sm:block sm:col-span-6"></div>

              <div className="sm:col-span-6">
                <label htmlFor="phone_number" className="block text-sm font-medium leading-6">
                  手机号码
                </label>
                <div className="mt-2 w-full">
                  <input
                    type="text"
                    name="phone_number"
                    id="phone_number"
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 backdrop-blur ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/*占位*/}
              <div className="hidden sm:block sm:col-span-6"></div>

              <div className="sm:col-span-6">
                <label htmlFor="code" className="block text-sm font-medium leading-6">
                  短信验证码
                </label>
                <div className="mt-2 w-full flex flex-nowrap items-center gap-x-2">
                  <input
                    type="text"
                    name="code"
                    id="code"
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 backdrop-blur ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm sm:leading-6"
                  />
                  <button
                    className={`min-w-32 rounded text-white text-nowrap whitespace-nowrap p-1.5 ${countdown !== 0 ? 'cursor-not-allowed bg-qlu/60' : 'bg-qlu'}`}
                    onClick={countdown === 0 ? sendCode : () => {
                    }}>
                    {countdown === 0 ? '获取验证码' : `重新发送 (${countdown}s)`}
                  </button>
                </div>
              </div>

              <div className="sm:col-span-full md:flex">
                <button
                  type="submit"
                  className="rounded-md bg-qlu w-full md:w-32 md:rounded-full px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={submit}
                >
                  提交
                </button>
              </div>

            </div>
          </div>
        </form>
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
    </>
  )
}
