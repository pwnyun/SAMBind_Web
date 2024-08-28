import level from "@province-city-china/level";
import {useEffect, useRef, useState} from "react";
import {validateIdCard} from "../utils.js";
import Modal from "../modal.jsx";
import axios from "axios";
import {TfiClose, TfiShareAlt} from "react-icons/tfi";
import {useSearchParams} from "react-router-dom";

export default function CollectionFormForOld() {
  const formRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const [province, setProvince] = useState("");
  const [provinceIndex, setProvinceIndex] = useState(-1);
  const [prefecture, setPrefecture] = useState("");
  const [prefectureIndex, setPrefectureIndex] = useState(-1);
  const [county, setCounty] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalButtonText, setModalButtonText] = useState("关闭");
  const [modalOptionalButton, setModalOptionalButton] = useState();

  const [refCode, setRefCode] = useState('');

  const [jumpButton] = useState(<button
    type="button"
    className={`inline-flex justify-center items-center rounded-md border border-transparent bg-blue-100 dark:bg-sky-900 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:text-gray-300 dark:hover:bg-sky-950`}
    onClick={() => {setShowModal(false); window.location = 'https://wlyw.qlu.edu.cn/wiki/help/'}}
  >
    <TfiShareAlt />&ensp;跳转
  </button>)

  const submit = () => {
    let formData = new FormData(formRef.current);
    console.log(formData)
    let errorMessage = ""

    if (!formData.get('department')) {
      errorMessage += "请选择录取学部（学院）；"
    }
    if (!formData.get('name')) {
      errorMessage += "姓名不能为空；"
    }
    if (!formData.get('phone') || formData.get('phone').trim().length !== 11 || isNaN(Number(formData.get('phone').trim()))) {
      errorMessage += "联系电话输入有误（可能不为 11 位或输入了非数字字符）；"
    }
    if (!formData.get('phone2') || formData.get('phone2').trim().length !== 11 || isNaN(Number(formData.get('phone2').trim()))) {
      errorMessage += "监护人联系电话输入有误（可能不为 11 位或输入了非数字字符）；"
    }
    if (!formData.get('qq') || isNaN(Number(formData.get('qq').trim()))) {
      errorMessage += "QQ 号输入有误（可能输入了非数字字符）；"
    }
    if (!validateIdCard(formData.get('id_card'))) {
      errorMessage += "身份证号输入有误；"
    }
    if (!formData.get('province') || provinceIndex < 0) {
      errorMessage += "请选择省份；"
    }
    if (!formData.get('address')) {
      errorMessage += "详细地址不能位空；"
    }
    if (!formData.get('captcha')) {
      errorMessage += "验证码不能为空；"
    }

    if (errorMessage !== '') {
      setShowModal(true)
      setModalContent(`${errorMessage}请检查输入。`)
      setModalButtonText("确认");
      setModalOptionalButton(null);
      return;
    }

    formData.set('ref_code', refCode)
    formData.set('address', `${province}+${prefecture}+${county}+${formData.get('address')}`);
    formData.delete('prefecture');
    formData.delete('county');

    axios({
      method: 'POST',
      url: '/api/submit',
      data: formData,
    }).catch(err => {
      setShowModal(true);
      setModalContent(err.message);
      setModalButtonText("确认");
      setModalOptionalButton(null);

    }).then(res => {
      setShowModal(true);
      setModalContent(res.data.message);

      if (res.data.status === "success") {
        setModalButtonText(<><TfiClose />&ensp;取消</>);
        setModalOptionalButton(jumpButton);
      } else {
        setModalButtonText("确认");
        setModalOptionalButton(null);
      }
    })
  }

  useEffect(() => {
    setProvince('山东省')
    setProvinceIndex(level.findIndex(item => item.name === '山东省'))

    console.log('level', level)

    // ref_code
    const refCode = searchParams.get('ref_code');
    console.log('refCode', refCode)
    if (refCode) {
      setRefCode(refCode)
      searchParams.set('ref_code', '')
    }

  }, []);

  return (<>
      <div className="container mx-auto max-w-[750px]">

        <div
          className="fixed mt-[620px] inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
          aria-hidden="true">
          <div
            className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
            style={{clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"}}>
            {/*  clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)
          */}
          </div>
        </div>

        <div className="image-container relative mb-[20px] bg-no-repeat w-full">
          <img className="object-cover object-bottom w-full h-[calc(100%-2px)] absolute left-0 top-0 z-[-10]"
               src="/assets/banner-compressed.png" alt=""/>
          <img className="object-cover w-full h-[calc(100%-4px)]"
               src="/assets/index-bg-mask.svg" alt=""/>
          <img className="object-cover translate-x-[-50%] h-[41.58%] absolute left-[50%] bottom-[12.3%] z-10"
               src="/assets/index-avatar-circle.svg" alt=""/>
          <img className="object-cover translate-x-[-50%] h-[36.82%] absolute left-[50%] bottom-[15.5%] z-20"
               src="/assets/qlu-logo-space.png" alt=""/>
          {/*<img*/}
          {/*  className="object-cover translate-x-[-50%] translate-y-[3px] absolute bottom-[3.11%] left-[50%] h-[27px] md:h-[36px]"*/}
          {/*  src="images/index-title.svg"/>*/}
          <div
            className="object-cover translate-x-[-50%] translate-y-[20px] absolute bottom-[3.11%] left-[50%] h-[27px] md:h-[36px] text-nowrap text-2xl flex flex-col justify-center items-center text-qlu font-bold">
            <div>齐鲁工业大学</div>
            <div>校园网账号申领表</div>
          </div>
        </div>

        <div
          className="border rounded-lg border-gray-400/50 bg-white/30 backdrop-blur px-4 py-4 mx-4 mt-16 text-gray-700">
          <div className="text-xl underline underline-offset-8 decoration-pink-500 decoration-2 font-medium py-2">
            校园网申领须知
          </div>
          <div className="pt-2">
            本表单为齐鲁工业大学校园网官方申领入口，请详细、准确的填写信息。<b>我们将会妥善的保护您的隐私数据</b>。当您提交申请后，我们将于七个工作日内邮寄绑定校园网的校园电话卡。
          </div>
          <div className="py-1 text-center text-gray-400 select-none">·&ensp;·&ensp;·&ensp;·</div>
          <div className="pb-2">
            除本表单外，任何第三方提供的、以校园网开通为名义的个人信息收集表单均非官方渠道，请各位新生注意保护信息安全，谨防诈骗。有任何疑问请联系齐鲁工业大学网络信息中心
            <a href="tel:0531-89631358">0531-89631358</a>。
          </div>
        </div>

        <form ref={formRef} onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}>
          <div className="border-b border-gray-900/10 p-4 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="department" className="block text-sm font-medium leading-6">
                  录取学部（院）
                </label>
                <div className="mt-2 w-full">
                  <select
                    id="department"
                    name="department"
                    defaultValue=""
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 ring-1 ring-inset ring-gray-300  focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
                    <option disabled hidden></option>
                    <option>材料科学与工程学部</option>
                    <option>电子电气与控制学部</option>
                    <option>光电科学与技术学部</option>
                    <option>海洋技术科学学部</option>
                    <option>菏泽校区（分院）</option>
                    <option>化学与制药学部</option>
                    <option>环境科学与工程学部</option>
                    <option>机械工程学部</option>
                    <option>基辅学院</option>
                    <option>计算机科学与技术学部</option>
                    <option>经济与管理学部</option>
                    <option>能源与动力工程学部</option>
                    <option>轻工学部</option>
                    <option>生物工程学部</option>
                    <option>食品科学与工程学部</option>
                    <option>数学与人工智能学部</option>
                    <option>体育与音乐学院</option>
                    <option>外国语学院（国际教育学院）</option>
                    <option>艺术设计学院</option>
                    <option>政法学院</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="name" className="block text-sm font-medium leading-6">
                  姓名
                </label>
                <div className="mt-2 w-full">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 backdrop-blur ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="phone" className="block text-sm font-medium leading-6">
                  联系电话
                </label>
                <div className="mt-2 w-full">
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    placeholder="联系电话"
                    autoComplete="tel"
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 backdrop-blur ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="qq" className="block text-sm font-medium leading-6">
                  QQ号
                </label>
                <div className="mt-2 w-full">
                  <input
                    type="text"
                    name="qq"
                    id="qq"
                    placeholder="QQ号"
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 backdrop-blur ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="id_card" className="block text-sm font-medium leading-6">
                  身份证号
                </label>
                <div className="mt-2 w-full">
                  <input
                    type="text"
                    name="id_card"
                    id="id_card"
                    placeholder="身份证号"
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 backdrop-blur ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="phone2" className="block text-sm font-medium leading-6">
                  监护人联系电话
                </label>
                <div className="mt-2 w-full">
                  <input
                    type="text"
                    name="phone2"
                    id="phone2"
                    placeholder="监护人联系电话"
                    autoComplete="tel"
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 backdrop-blur ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/*省份*/}
              <div className="sm:col-span-2">
                <label htmlFor="province" className="block text-sm font-medium leading-6">
                  收件地址
                </label>
                <div className="mt-2 w-full">
                  <select
                    id="province"
                    name="province"
                    value={province}
                    onChange={(e) => {
                      if (e.target.value !== province) {
                        setProvince(e.target.value);
                        setProvinceIndex(parseInt(e.target.selectedOptions[0].id))
                        setPrefecture("")
                        setPrefectureIndex(-1)
                        setCounty("")
                      }
                    }}
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 backdrop-blur ring-1 ring-inset ring-gray-300  focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs text-sm sm:leading-6"
                  >
                    <option value="" disabled hidden></option>
                    {level
                      .map((province, index) =>
                        <option key={province.code} id={index}>{province.name}</option>
                      )
                    }
                  </select>
                </div>
              </div>

              {/*地级市*/}
              <div
                className={`sm:col-span-2 ${(provinceIndex === -1 || level[provinceIndex].children === undefined || level[provinceIndex].children.length === 0) && 'hidden'}`}>
                <label htmlFor="prefecture" className="hidden sm:block text-sm font-medium leading-6">
                  &emsp;
                </label>
                <div className="mt-2 w-full">
                  <select
                    id="prefecture"
                    name="prefecture"
                    value={prefecture}
                    onChange={(e) => {
                      if (e.target.value !== prefecture) {
                        setPrefecture(e.target.value);
                        setPrefectureIndex(parseInt(e.target.selectedOptions[0].id))
                        setCounty("")
                      }
                    }}
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 backdrop-blur ring-1 ring-inset ring-gray-300  focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs text-sm sm:leading-6"
                  >
                    <option value="" disabled hidden></option>
                    {provinceIndex !== -1 && level[provinceIndex]?.children?.map((prefecture, index) =>
                      <option key={prefecture.code} id={index}>{prefecture.name}</option>
                    )}
                  </select>
                </div>
              </div>

              {/*县级市*/}
              <div
                className={`sm:col-span-2 ${(prefectureIndex === -1 || level[provinceIndex].children[prefectureIndex].children === undefined || level[provinceIndex].children[prefectureIndex].children.length === 0) && 'hidden'}`}>
                <label htmlFor="county" className="hidden sm:block text-sm font-medium leading-6">
                  &emsp;
                </label>
                <div className="mt-2 w-full">
                  <select
                    id="county"
                    name="county"
                    value={county}
                    onChange={(e) => {
                      if (e.target.value !== county) {
                        setCounty(e.target.value)
                      }
                    }}
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 backdrop-blur ring-1 ring-inset ring-gray-300  focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs text-sm sm:leading-6"
                  >
                    <option value="" disabled hidden></option>
                    {prefectureIndex !== -1 && level[provinceIndex]?.children[prefectureIndex]?.children?.map((county, index) =>
                      <option key={county.code} id={index}>{county.name}</option>
                    )}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-full">
                <label htmlFor="address" className="block text-sm font-medium leading-6">
                  详细地址
                </label>
                <div className="mt-2 w-full">
                  <input
                    type="text"
                    name="address"
                    id="address"
                    placeholder="详细地址"
                    autoComplete="address"
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 backdrop-blur ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="captcha" className="block text-sm font-medium leading-6">
                  验证码
                </label>
                <div className="mt-2 w-full flex items-center gap-x-2">
                  {/*宽度随意，高度最好小于等于36px*/}
                  <img src="/api/captcha" className="bg-amber-500 w-auto h-full flex-grow text-nowrap" alt="验证码"
                       onClick={e => {
                         e.target.src = '/api/captcha?' + Math.random()
                       }}
                  />
                  <input
                    type="text"
                    name="captcha"
                    id="captcha"
                    placeholder="验证码"
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 backdrop-blur ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-full md:flex">
                <button
                  type="submit"
                  className="rounded-md bg-qlu w-full md:w-32 md:rounded-full px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
        <div>&copy;2024 齐鲁工业大学 | 网络信息中心</div>
        <div>联系方式：<a href="tel:0531-89631358">0531-89631358</a></div>
      </div>

      <Modal isOpen={showModal} setIsOpen={setShowModal} buttonText={modalButtonText} optionalButton={modalOptionalButton}>
        {modalContent}
      </Modal>
    </>
  )
}
