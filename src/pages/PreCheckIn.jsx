import {useEffect, useRef, useState} from "react";
import {getLoginInfo, request, validateIdCard} from "../utils.js";
import {useNavigate} from "react-router-dom";
import {TfiClose, TfiShareAlt} from "react-icons/tfi";
import Modal from "../modal.jsx";
import {useImmer} from "use-immer";
import FileUploaderZone from "../file-uploader-zone.jsx";
import {PiSealWarning} from "react-icons/pi";

const plans = ['私家车', '出租车', '公共交通']

export default function PreCheckIn() {
  const navigate = useNavigate();

  const [isp, setIsp] = useImmer([
    {checked: false, name: '移动', abbr: 'cmcc'},
    {checked: false, name: '联通', abbr: 'cu'},
    {checked: false, name: '电信', abbr: 'ct'}])
  const [advertising, setAdvertising] = useImmer([
    {checked: false, name: 'QQ 群', abbr: 'qq'},
    {checked: false, name: '微信群', abbr: 'wx'},
    {checked: false, name: '电话推销', abbr: 'tel'},
    {checked: false, name: '公众号等', abbr: 'gzh'},]);

  const formRef = useRef(null)
  const [name, setName] = useState("")
  const [idCard, setIdCard] = useState("")
  const [token, setToken] = useState("")
  const [arriveOnTime, setArriveOnTime] = useState("");

  // 两个 bool 选项，控制营销调查中多选表单是否选无
  const [receivedAdvertising, setReceivedAdvertising] = useState(false)
  const [sourceOfAdvertising, setSourceOfAdvertising] = useState(false)

  const [file, setFile] = useState(null)

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalButtonText, setModalButtonText] = useState("关闭");
  const [modalOptionalButton, setModalOptionalButton] = useState();

  const [jumpButton] = useState(
    <button type="button"
            className={`inline-flex justify-center items-center rounded-md border border-transparent bg-blue-100 dark:bg-sky-900 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:text-gray-300 dark:hover:bg-sky-950`}
            onClick={() => {
              setShowModal(false);
              navigate('/directions')
            }}>
      <TfiShareAlt/>&ensp;跳转
    </button>
  )

  const submit = () => {
    let formData = new FormData(formRef.current);
    console.debug(formData)
    let errorMessage = ""

    if (!validateIdCard(formData.get('id_card'))) {
      errorMessage += "居民身份证号码校验有误，请确认新生身份核验通过，如有疑问请联系网络信息中心：0531-89631358；"
    }
    if (!formData.get("name") || !formData.get("token")) {
      errorMessage += "新生身份校验有误，请确认新生身份核验通过，如有疑问请联系网络信息中心：0531-89631358；"
    }

    let status = formData.get("status")

    if (status === "true") {
      if (!formData.get("arrival_date")) {
        errorMessage += "请选择拟到校日期；"
      }
      if (!formData.get("arrival_time")) {
        errorMessage += "请选择拟到校时间；"
      }
      if (!formData.get("arrival_method")) {
        errorMessage += "请选择到校交通方式；"
      }

    } else if (status === "false") {
      if (!formData.get("not_arrival_reason")) {
        errorMessage += "请填写无法按时报到原因；"
      }
    } else {
      errorMessage += "请选择能否按通知书规定的时间报到；"
    }

    if (formData.get('received_advertising').toString() === "true") {
      if (!formData.get("source_of_advertising")) {
        errorMessage += "请完成运营商营销调查；"
      }
    }

    if (errorMessage !== '') {
      setShowModal(true)
      setModalContent(`${errorMessage}请检查输入。`)
      setModalButtonText("确认");
      setModalOptionalButton(null);
      return;
    }

    formData.set('arrival_date', formData.get('arrival_date') + formData.get('arrival_time'));

    if (file) {
      // 需要上传图片
      const fileForm = new FormData();
      fileForm.append('file', file)
      fileForm.append('token', token)
      request({
        url: '/api/upload_image',
        method: 'PUT',
        data: fileForm
      }).then(res => {
        if (res.status === "not-upload")
          return;

        if (res.status !== "success") {
          setShowModal(true);
          setModalContent(`上传图片失败：${res.message}`);
          setModalButtonText("确认");
          setModalOptionalButton(null);
          return;
        }

        submitRequest()
      })
    } else {
      // 不需要上传图片：直接提交表单
      submitRequest()
    }


    function submitRequest() {
      request({
        method: 'POST',
        url: '/api/submit_pre_registration',
        data: formData,
      }).then(res => {
        setShowModal(true);
        setModalContent(res.message);

        if (res.status === "success") {
          request({
            url: '/api/update_pre_registration_status',
            method: 'POST',
            data: {name, id_card: idCard, token: token, pre_registration_done: 1},
          })
          setModalButtonText(<><TfiClose/>&ensp;取消</>);
          setModalOptionalButton(jumpButton);
        } else {
          setModalButtonText("确认");
          setModalOptionalButton(null);
        }
      })
    }

  }

  // 检查是否已登录
  useEffect(() => {
    getLoginInfo().then(res => {
      if (!res.status) {
        console.error('pre-check-in: getLoginInfo fail.')
        navigate('/');
      } else {
        let {name, idCard, token} = res
        setName(name)
        setIdCard(idCard)
        setToken(token)
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
            <div>齐鲁工业大学</div>
            <div>新生预报到</div>
          </div>
        </div>

        <form ref={formRef} onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}>

          <input type="text" name="name" hidden readOnly value={name}/>
          <input type="text" name="id_card" hidden readOnly value={idCard}/>
          <input type="text" name="token" hidden readOnly value={token}/>

          <div className="border-b border-gray-900/10 p-4 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-12">

              <div className="sm:col-span-6">
                <label htmlFor="arrive-on-time" className="block text-sm font-medium leading-6">
                  能否按时报到
                </label>
                <div className="mt-2 w-full">
                  <select
                    id="arrive-on-time"
                    name="status"
                    value={arriveOnTime}
                    onChange={(e) => setArriveOnTime(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 ring-1 ring-inset ring-gray-300  focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm sm:leading-6"
                  >
                    <option value="" disabled hidden></option>
                    <option value="true">能够按通知书规定的时间报到</option>
                    <option value="false">无法按时报到</option>
                  </select>
                </div>
              </div>

              {/*占位*/}
              <div className="hidden sm:block sm:col-span-3"></div>

              {arriveOnTime === "true" && <>
                <div className="sm:col-span-6">
                  <label htmlFor="arrive-date" className="block text-sm font-medium leading-6">
                    拟到校时间
                  </label>
                  <div className="mt-2 w-full">
                    <select
                      id="arrive-date"
                      name="arrival_date"
                      defaultValue=""
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 ring-1 ring-inset ring-gray-300  focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm sm:leading-6"
                    >
                      <option value="" disabled hidden></option>
                      <option value="2024-08-31T">8 月 31 日</option>
                      <option value="2024-09-01T">9 月 1 日（仅菏泽校区）</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="arrive_time" className="block text-sm font-medium leading-6">
                    &emsp;
                  </label>
                  <div className="mt-2 w-full">
                    <input
                      type="time"
                      name="arrival_time"
                      id="arrive_time"
                      min="04:00"
                      max="23:30"
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 backdrop-blur ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="transportation" className="block text-sm font-medium leading-6">
                    到校方式
                  </label>
                  <div className="mt-2 w-full">
                    {plans.map((plan, index) => {
                      return (
                        <div key={plan}
                             className="flex items-center justify-start gap-x-2"
                        >
                          <input
                            type="radio"
                            name="arrival_method"
                            id={`transportation-${index}`}
                            className=""
                            value={plan}
                          />
                          <label htmlFor={`transportation-${index}`} className="py-3 w-full text-sm">{plan}</label>
                        </div>)
                    })}

                  </div>
                </div>
              </>}

              {arriveOnTime === "false" && <>
                <div className="sm:col-span-6">
                  <label htmlFor="reason" className="block text-sm font-medium leading-6">
                    无法按时报到原因
                  </label>
                  <div className="mt-2 w-full">
                    <textarea
                      name="not_arrival_reason"
                      id="reason"
                      rows={3}
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 backdrop-blur ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </>}

              <div className="sm:col-span-12">
                <label htmlFor="received_advertising" className="block text-sm font-medium leading-6">
                  是否曾收到运营商校园卡电话卡推销
                </label>
                <div className="mt-2 w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-5 items-center justify-start gap-x-2 text-sm">
                    <div className="grow text-nowrap whitespace-nowrap">
                      <input
                        type="checkbox"
                        name="received_advertising"
                        id="received_advertising-none"
                        className="m-2"
                        value='无'
                        checked={!receivedAdvertising}
                        onChange={(e) => {
                          setIsp(isp.map(item => {
                            return {...item, checked: false}
                          }))
                          setReceivedAdvertising(!e.target.checked)
                        }}
                      />
                      <label htmlFor="received_advertising-none"
                             className="py-3 w-full inline-block">无</label>
                    </div>
                    {isp.map((item, index) => {
                      return (
                        <div className="grow text-nowrap whitespace-nowrap" key={index}>
                          <input
                            type="checkbox"
                            name="received_advertising"
                            id={`received_advertising-${item.abbr}`}
                            className="m-2"
                            value={`收到${item.name}`}
                            checked={item.checked}
                            onChange={(e) => {
                              setIsp(draft => {
                                draft[index].checked = e.target.checked
                              })
                              setReceivedAdvertising(true)

                              let filtered = isp.filter(isp => isp.checked === true)
                              if (filtered.length === 1 && filtered[0].abbr === item.abbr)
                                setReceivedAdvertising(false)
                            }}
                          />
                          <label htmlFor={`received_advertising-${item.abbr}`}
                                 className="py-3 w-full inline-block">收到{item.name}</label>
                        </div>)
                    })}
                  </div>

                  <div className="mt-2 text-sm rounded border-2 p-3 flex flex-col">
                    <div className="flex items-center">
                      <PiSealWarning className="w-8 h-8 text-red-600 flex-shrink-0 mr-2"/>
                      <div className="flex items-center font-bold">重要提示</div>
                    </div>
                    <div className="mt-2">
                      <div className="indent-8 md:indent-0">以上推销涉嫌侵犯用户隐私，学校将查处相关组织与人员。</div>
                      <div
                        className="indent-8 md:indent-0">我们会给予每条线索的首位提供者一定奖励。请勿在非官方平台提供个人隐私信息，谨防电信诈骗。
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {receivedAdvertising && <>
                <div className="sm:col-span-12">
                  <label htmlFor="source_of_advertising" className="block text-sm font-medium leading-6">
                    推销方式
                  </label>
                  <div className="mt-2 w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-5 items-center justify-start gap-x-2 text-sm">
                      <div className="grow text-nowrap whitespace-nowrap">
                        <input
                          type="checkbox"
                          name="source_of_advertising"
                          id="source_of_advertising-none"
                          className="m-2"
                          value='无'
                          checked={!sourceOfAdvertising}
                          onChange={(e) => {
                            setAdvertising(advertising.map(item => {
                              return {...item, checked: false}
                            }))
                            setSourceOfAdvertising(!e.target.checked)
                          }}
                        />
                        <label htmlFor="source_of_advertising-none"
                               className="py-3 w-full inline-block">无</label>
                      </div>
                      {advertising.map((item, index) => {
                        return (
                          <div className="grow text-nowrap whitespace-nowrap" key={index}>
                            <input
                              type="checkbox"
                              name="source_of_advertising"
                              id={`source_of_advertising-${item.abbr}`}
                              className="m-2"
                              value={item.name}
                              checked={item.checked}
                              onChange={(e) => {
                                setAdvertising(draft => {
                                  draft[index].checked = e.target.checked
                                })
                                setSourceOfAdvertising(true)

                                let filtered = advertising.filter(ad => ad.checked === true);
                                if (filtered.length === 1 && filtered[0].abbr === item.abbr)
                                  setSourceOfAdvertising(false)
                              }}
                            />
                            <label htmlFor={`source_of_advertising-${item.abbr}`}
                                   className="py-3 w-full inline-block">{item.name}</label>
                          </div>)
                      })}
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-12">
                  <label htmlFor="source_of_advertising" className="block text-sm font-medium leading-6">
                    上传推销页面截图
                  </label>
                  <div className="mx-auto mt-2 w-full max-w-screen-md px-2 sm:px-0">
                    <FileUploaderZone file={file} setFile={setFile}/>
                  </div>
                </div>
              </>}

              {arriveOnTime && <div className="sm:col-span-full md:flex">
                <button
                  type="submit"
                  className="rounded-md bg-qlu w-full md:w-32 md:rounded-full px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  提交
                </button>
              </div>
              }

            </div>
          </div>
        </form>
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
    </>
  )
}
