import {useEffect, useRef, useState} from "react";
import {FaCircleQuestion, FaNetworkWired, FaTowerCell, FaWifi} from "react-icons/fa6";
import {request} from "../utils.js";
import {useVisitorData} from "@fingerprintjs/fingerprintjs-pro-react";
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import localforage from "localforage";

export default function Feedback() {
  const formRef = useRef(null);
  const [agreeContact, setAgreeContact] = useState(false);
  const [questions] = useState([
    {
      icon: "cell",
      role: "global",
      str: "您%role%内运营商 4G/5G 通话情况",
      options: ["非常好", "基本满意", "信号一般", "信号差"]
    },
    {
      icon: "cell",
      role: "global",
      str: "您%role%内运营商 4G/5G 上网情况",
      options: ["非常好", "基本满意", "信号一般", "信号差"]
    },
    {
      icon: "cell",
      role: "global",
      str: "您%role%内上网高峰时间段运营商 4G/5G 上网情况",
      options: ["非常好", "基本满意", "偶尔卡顿严重", "不清楚"]
    },
    {
      icon: "wire",
      role: "global",
      str: "您%role%内校园网有线上网情况",
      options: ["非常好", "基本满意", "信号一般", "信号差"]
    },
    {
      icon: "wifi",
      role: "global",
      str: "您%role%内校园网无线上网情况",
      options: ["非常好", "基本满意", "信号一般", "信号差"]
    },
    {
      icon: "wire",
      role: "global",
      str: "您%role%内有线网络接口数量是否足够？",
      options: ["足够", "不足", "自己增加了转接设备"]
    },
    {
      icon: "wifi",
      role: "global",
      str: "无线校园网连接后，能够自动打开认证网页，并且在很短的时间内完成认证操作？",
      options: ["一直可以", "偶尔不行", "一直不行，需要手动打开网页认证"]
    },
    {
      icon: "    ",
      role: "student",
      str: "您没有办理校园网套餐的原因？",
      options: ["（我办理了，跳过问题）", "不需要，流量够用", "校园网速度慢", "校园网延迟高", "校园网收费高"]
    },
    {
      icon: "    ",
      role: "student",
      str: "您是否有办理校园网套餐的意愿？",
      options: ["（我办理了，跳过问题）", "校园网提速后考虑", "不考虑"]
    },
    {
      icon: "wifi",
      role: "student",
      str: "在您的宿舍中，高负载状态下（例如整个宿舍连接校园网且同时下载大文件、同时更新游戏等场景），无线网络是否仍然能保持较高速率（网速高于 30MBps，即 4MB/s）？",
      options: ["能", "偶尔不能", "不能", "不清楚"]
    },
    {
      icon: "wifi",
      role: "student",
      str: "无线校园网比较稳定，在游戏中很少出现延迟较大波动（波动超过 10ms）的情况？",
      options: ["没有较大波动", "偶尔波动", "波动明显", "不清楚"]
    },
    {
      icon: "cell",
      role: "global",
      str: "您手机卡使用的运营商？",
      options: ["移动", "联通", "电信", "广电"]
    }
  ]);
  const [role, setRole] = useState("teacher");
  const [count, setCount] = useState(0)
  const [fpBasic, setFpBasic] = useState("");
  const [fpPro, setFpPro] = useState("");

  // fp basic
  const fpPromise = FingerprintJS.load()

  // fp pro
  const {isLoading, error, data, getData} = useVisitorData(
    {extendedResult: true},
    {immediate: true}
  )

  // get fp
  useEffect(() => {
    async function fn() {
      console.log(isLoading, error, data, getData)
      try {
        const fpProData = await getData()
        setFpPro(fpProData)
      } catch {
        setFpPro("ERROR")
      }

      try {
        const fpBasic = await fpPromise
        const result = await fpBasic.get()
        console.log("fpBasic", result.visitorId)
        setFpBasic(result.visitorId)
      } catch {
        setFpBasic("ERROR")
      }
    }

    fn()
  }, []);

  useEffect(() => {
    localforage.getItem("202409_campus_network").then(res => {
      if (res === "feedback_success") {
        alert('请勿重复提交')
        window.close()
      }
    })
  }, []);

  useEffect(() => {
    setCount(questions.filter(question => question.role === "global" || question.role === role).length);
  }, [role])

  const submit = async () => {
    let formData = new FormData(formRef.current)
    formData.set("agree-contact", agreeContact.toString())
    formData.set("fp", JSON.stringify([fpBasic, fpPro]))
    // console.log(fpBasic, fpPro)
    console.log('表单', formData)

    if (await localforage.getItem("202409_campus_network") === "feedback_success") {
      alert('请勿重复提交')
      window.close()
    }

    request({
      url: '/api/submit-feedback',
      method: 'POST',
      data: formData,
    }).then(res => {
      console.log(res)
      if (res.status === 'success') {
        localforage.setItem("202409_campus_network", "feedback_success")
        alert("提交成功，我们已收到您的反馈，请关闭该页面。")
        window.close()
      } else {
        alert(res.message)
      }
    })
  }

  return (<>
    <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
        <div
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          style={{clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'}}></div>
      </div>
      <div className="mx-auto max-w-2xl">
        <h2 className="pb-8 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center">
          长清校区网络意见反馈表
        </h2>
        {/*<p className="mt-2 text-lg leading-8 text-gray-600 indent-8">*/}
        {/*  10月26日，网络信息中心对彩石校园网进行了改造工作，通过中国移动线路出口，解决了曾经的卡顿问题。*/}
        {/*</p>*/}
        {/*<p className="mt-2 text-lg leading-8 text-gray-600 indent-8">*/}
        {/*  为更好地服务彩石校区师生，现收集彩石校区关于网络的意见及建议。*/}
        {/*</p>*/}
      </div>
      <form id="form" className="mx-auto mt-16 max-w-xl sm:mt-20" onSubmit={(e) => e.preventDefault()} ref={formRef}>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">

          <div className="sm:col-span-2">
            <label htmlFor={`q-role`}
                   className="text-sm font-semibold leading-6 text-gray-900 ">
              <span>1、</span>
              <FaCircleQuestion className="w-6 h-6 text-sky-600 min-w-6 mr-2 inline"/>
              <span>您的身份？</span>
            </label>
            <div className="mt-2.5 grid-cols-5 text-sm">
              <div className="col-span-1 flex items-center gap-x-2">
                <input type="radio" name={`q-role`} id={`q-role-teacher`} onChange={() => setRole("teacher")}
                       checked={role === "teacher"} value="teacher"/>
                <label htmlFor={`q-role-teacher`}
                       className="w-full h-8 flex items-center">教职工</label>
              </div>
              <div className="col-span-1 flex items-center gap-x-2">
                <input type="radio" name={`q-role`} id={`q-role-student`} onChange={() => setRole("student")}
                       checked={role === "student"} value="student"/>
                <label htmlFor={`q-role-student`}
                       className="w-full h-8 flex items-center">学生</label>
              </div>
            </div>
          </div>

          {questions.map((question, index) => {
            let isShow = question.role === "global" ? true : question.role === role;

            if (isShow)
              return (
                <div className="sm:col-span-2" key={`q-${index}`}>
                  <label htmlFor={`q-${index}`}
                         className="text-sm font-semibold leading-6 text-gray-900 ">
                    <span>{index + 2}、</span>
                    {question.icon === 'wifi'
                      ? <FaWifi className="w-6 h-6 text-teal-600 min-w-6 mr-2 inline"/>
                      : question.icon === 'cell'
                        ? <FaTowerCell className="w-6 h-6 text-sky-600 min-w-6 mr-2 inline"/>
                        : question.icon === 'wire'
                          ? <FaNetworkWired className="w-6 h-6 text-sky-600 min-w-6 mr-2 inline"/>
                          : <FaCircleQuestion className="w-6 h-6 text-sky-600 min-w-6 mr-2 inline"/>
                    }
                    <span>{question.str.replaceAll("%role%", role === "teacher" ? "办公室" : "宿舍")}</span>
                  </label>
                  <div className="mt-2.5 grid-cols-5 text-sm">
                    {question.options.map((option, optionIndex) => {
                      return (
                        <div className="col-span-1 flex items-center gap-x-2" key={`q-${index}-${optionIndex}`}>
                          <input type="radio" name={`q-${index}`} id={`q-${index}-${optionIndex}`}/>
                          <label htmlFor={`q-${index}-${optionIndex}`}
                                 className="w-full h-8 flex items-center">{option}</label>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
          })}

          <div className="sm:col-span-2">
            <label htmlFor="q-location"
                   className="block text-sm font-semibold leading-6 text-gray-900">
              <span>{count + 2}、</span>
              <FaCircleQuestion className="w-6 h-6 text-sky-600 min-w-6 mr-2 inline"/>
              <span>{role === "teacher" ? "办公室" : "宿舍"}具体位置（宿舍楼号、楼层）</span>
            </label>
            <div className="text-gray-600 text-sm">
              * 为方便实地勘察，请留下您的<b>**具体**</b>位置，包含楼宇名称、楼层、房间号。
            </div>
            <div className="mt-2.5">
              <input type="text" name="q-location" id="q-location" placeholder="例如，机电楼B座666房间"
                     className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="q-other-place"
                   className="block text-sm font-semibold leading-6 text-gray-900">
              <span>{count + 3}、</span>
              <FaWifi className="w-6 h-6 text-teal-600 min-w-6 mr-2 inline"/>
              <span>另有其他区域网络需要反馈，请在下方填写：</span>
            </label>
            <div className="mt-2.5">
              <textarea name="q-other-place" id="q-other-place" rows="4" placeholder="请填写具体位置和问题"
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></textarea>
            </div>
          </div>

          <div className="flex gap-x-4 sm:col-span-2">
            <div className="flex h-6 items-center toggle">
              <button type="button" id="agree-contact" name="agree-contact" role="switch"
                      className={`${agreeContact ? 'bg-indigo-600' : 'bg-gray-200'} flex w-8 flex-none cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                      onClick={() => setAgreeContact(!agreeContact)}
              >
                <span aria-hidden="true" id="toggle-span"
                      className={`${agreeContact ? 'translate-x-3.5' : 'translate-x-0'} h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out`}></span>
              </button>
            </div>
            <label htmlFor="agree-contact" className="text-sm leading-6 text-gray-800 toggle w-full">
              在有需要的前提下，工作人员后续可以通过手机号、QQ号联系我。
            </label>
            <input type="text" name="agree-contact" id="agree-contact" hidden/>
          </div>

          <div className={agreeContact ? 'block' : 'hidden'}>
            <label htmlFor="phone-number"
                   className="block text-sm font-semibold leading-6 text-gray-900">手机号</label>
            <div className="mt-2.5">
              <input type="text" name="phone-number" id="phone-number" autoComplete="tel"
                     className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
            </div>
          </div>

          <div className={agreeContact ? 'block' : 'hidden'}>
            <label htmlFor="qq-number" className="block text-sm font-semibold leading-6 text-gray-900">QQ号</label>
            <div className="mt-2.5">
              <input type="text" name="qq-number" id="qq-number" autoComplete="off"
                     className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
            </div>
          </div>

        </div>
        <div className="mt-10">
          <button id="submit"
                  onClick={submit}
                  className="block w-full rounded-md bg-qlu px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            提交
          </button>
        </div>
      </form>
    </div>
  </>)
}
