import {useRef, useState} from "react";
import {FaNetworkWired, FaWifi} from "react-icons/fa6";

export default function Feedback() {
  const formRef = useRef(null);
  const [agreeContact, setAgreeContact] = useState(false);
  const [questions] = useState([
    {icon: "wifi", str: "您对无线网络提速的态度？"},
    {icon: "wifi", str: "在您的宿舍环境，高负载状态下（例如晚上同时下载、更新游戏时），无线网络是否仍然能保持较高速率（网速高于 30MBps，即 4MB/s）？"},
    {icon: "wifi", str: "无线校园网连接后，能够自动打开认证网页，并且在很短的时间内完成认证操作？"},
    {icon: "wifi", str: "无线校园网比较稳定，在游戏中很少出现延迟较大波动（波动超过 10ms）的情况？"},
    {icon: "wire", str: "您对有限网络速度调整的态度？"},
    {icon: "wire", str: "在您的宿舍环境下，使用有线网络？"},
    {icon: "wire", str: "在您的宿舍环境下，有线网络日常体验几乎没有变化？"},
    {icon: "wire", str: "在您的宿舍环境下，有线网络的下载体验几乎没有变化？"},
    {icon: "wire", str: "有线网络非常稳定，CF、LOL等腾讯系游戏延迟很低（低于 50ms）？"},
    {icon: "wire", str: "有线网络连接后，能够自动打开认证网页，并且在很短的时间内完成认证操作？"},
  ]);
  const [options] = useState(["非常不赞同", "不赞同", "一般", "赞同", "非常赞同", "我不明白这个问题的含义"])

  const submit = () => {
    let formData = new FormData(formRef.current)
    formData.set("agree-contact", agreeContact)
    console.log('表单', formData)


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
          长清校区校园网升级意见反馈表
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

          <div>
            <label htmlFor="phone-number"
                   className="block text-sm font-semibold leading-6 text-gray-900">手机号</label>
            <div className="mt-2.5">
              <input type="text" name="phone-number" id="phone-number" autoComplete="tel"
                     className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
            </div>
          </div>

          <div>
            <label htmlFor="qq-number" className="block text-sm font-semibold leading-6 text-gray-900">QQ号</label>
            <div className="mt-2.5">
              <input type="text" name="qq-number" id="qq-number" autoComplete="off"
                     className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
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
            <label htmlFor="agree-contact" className="text-sm leading-6 text-gray-600 toggle w-full">
              我同意工作人员通过手机号、QQ号联系我。
            </label>
            <input type="text" name="agree-contact" id="agree-contact" hidden/>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="info"
                   className="block text-sm font-semibold leading-6 text-gray-900">姓名、学/工号（选填）</label>
            <div className="mt-2.5">
              <input type="text" name="info" id="info" autoComplete="given-name"
                     className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="info-2"
                   className="block text-sm font-semibold leading-6 text-gray-900">宿舍楼号、楼层（选填）</label>
            <div className="text-gray-600 text-sm">
              * 我们结合下面问题综合研判楼层网络设备状况，以确定下一步是否继续升级设备。
            </div>
            <div className="mt-2.5">
              <input type="text" name="info-2" id="info-2" autoComplete="given-name"
                     className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
            </div>
          </div>

          {questions.map((question, index) => {
            return (
              <div className="sm:col-span-2" key={`q-${index}`}>
                <label htmlFor={`q-${index}`}
                       className="text-sm font-semibold leading-6 text-gray-900 flex items-center">
                  {index + 1}、
                  {question.icon === 'wifi'
                    ? <FaWifi className="w-6 h-6 text-teal-600 min-w-6 mr-2"/>
                    : <FaNetworkWired className="w-6 h-6 text-sky-600 min-w-6 mr-2"/>}
                  {question.str}
                </label>
                <div className="mt-2.5 grid-cols-5 text-sm">
                  {options.map((option, optionIndex) => {
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
            <label htmlFor="q-input"
                   className="block text-sm font-semibold leading-6 text-gray-900">{questions.length + 1}、【无线网络】如果您遇到校园网无线信号覆盖弱、网速差的地点，请在下面填写，我们将查缺补漏：</label>
            <div className="mt-2.5">
              <textarea name="q-input" id="q-input" rows="4"
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></textarea>
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
