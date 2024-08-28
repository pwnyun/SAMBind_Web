import {Link, useNavigate} from "react-router-dom";
import {FaArrowRight, FaCheck} from "react-icons/fa6";
import {useEffect, useState} from "react";
import {getLoginInfo, request} from "../utils.js";
import Modal from "../modal.jsx";
import {useImmer} from "use-immer";
import {MdOutlineRemoveCircleOutline} from "react-icons/md";

export default function Directions() {
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);
  const [loginInfo, setLoginInfo] = useImmer({name: '', idCard: '', token: ''})

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalButtonText, setModalButtonText] = useState("关闭");
  const [modalOptionalButton, setModalOptionalButton] = useState(null);

  const renderIcon = (status) => {
    if (status === 'false')
      return <FaArrowRight className="absolute left-3 top-3 h-5 w-5 text-qlu" aria-hidden="true"/>
    if (status === 'disable')
      return <MdOutlineRemoveCircleOutline className="absolute left-3 top-3 h-5 w-5 text-stone-500" aria-hidden="true"/>
    if (status === 'true')
      return <FaCheck className="absolute left-3 top-3 h-5 w-5 text-green-600" aria-hidden="true"/>
  }

  const checkForm = ({features}) => {
    let index1 = features.findIndex((item) => item.name === '信息采集')
    let index2 = features.findIndex((item) => item.name === '预报到')

    if (index1 === -1 || index2 === -1) {
      // setShowModal(true)
      // setModalContent("DEBUG: 检查 信息采集 和 预报到 的函数需要更新！")
      console.error("DEBUG: 检查 信息采集 和 预报到 的函数需要更新！")
      return false;
    }

    // return features[index1].status === 'true' && features[index2].status === 'true';
    return features[index1].status === 'true';
  }

  const updateReadStatus = ({id, loginInfo}) => {
    let data = {...loginInfo, id_card: loginInfo.idCard}
    data[`${id}_done`] = 1

    request({
      url: `/api/update_${id}_status`,
      method: 'POST',
      data
    })
  }

  // const lookupDormitory = ({features}) => {
  //   if (checkForm({features})) {
  //     setShowModal(true)
  //     setModalContent("您的宿舍信息尚未确定，请过几日再来查询。")
  //   } else {
  //     setShowModal(true)
  //     setModalContent("请先填写“信息采集”表。")
  //   }
  // }

  // const lookupClass = ({features}) => {
  //   if (checkForm({features})) {
  //     setShowModal(true)
  //     setModalContent("您的分班信息尚未确定，请过几日再来查询。")
  //   } else {
  //     setShowModal(true)
  //     setModalContent("请先填写“信息采集”表。")
  //   }
  // }

  const showDisableTip = () => {
    setShowModal(true)
    setModalContent("正在升级维护中，请过几日再试。")
  }

  const lookupDormitory = ({loginInfo}) => {
    request({
      url: '/api/room_information',
      method: 'GET',
      params: {name: loginInfo.name, id_card: loginInfo.idCard, token: loginInfo.token},
    }).then(res => {
      console.log(res)
      if (res.status !== 'success') {
        setShowModal(true)
        setModalContent(`查询失败：${res.message}`)
      } else {
        setShowModal(true)
        setModalContent(`您的宿舍为：${res.room}`)
      }
    })
  }

  const [features, setFeatures] = useImmer([
    {
      name: '信息采集',
      description: '点击进入新生信息采集表单',
      finishDescription: '已采集。',
      status: 'false',
      action: Link,
      url: '/collection-form',
      target: '_self',
      id: 'collection',
      event: () => {
      }
    }, {
      name: '一号通激活',
      description: '点击跳转到一号通激活指南',
      finishDescription: '已查看。',
      status: 'false',
      action: Link,
      url: 'https://wlyw.qlu.edu.cn/wiki/help/sso/',
      target: '_self',
      id: 'sso',
      event: updateReadStatus
    }, {
      name: '线上缴费',
      description: '点击跳转至计财处智慧财务系统',
      finishDescription: '已查看。',
      status: 'false',
      action: Link,
      url: 'https://qlgydx.mp.sinojy.cn',
      target: '_self',
      id: 'bill',
      event: updateReadStatus
    }, {
      name: 'OS 平台注册',
      description: '点击跳转到工大OS激活指南',
      finishDescription: '已查看。',
      status: 'disable',
      action: 'div',
      url: 'https://wlyw.qlu.edu.cn/wiki/help/os/',
      target: '_self',
      id: 'os',
      event: showDisableTip, //updateReadStatus
    }, {
      name: '宿舍查询',
      description: '点击查看宿舍分配信息',
      finishDescription: '已查询。',
      status: 'false',
      action: 'div',
      id: 'dormitory',
      event: lookupDormitory
    }, {
      name: '分班信息查询',
      description: '点击查看分班信息',
      finishDescription: '已查看。',
      status: 'false',
      action: Link,
      url: '/allocate-class',
      id: 'allocate_class',
      event: () => {
      }
    }, {
      name: '预报到',
      description: '点击进入预报到系统',
      finishDescription: '已预报到。',
      status: 'false',
      action: Link,
      url: '/pre-check-in',
      target: '_self',
      id: 'pre_registration',
      event: () => {
      }
    },])

  // 注册显示/离开页面监听函数 & 检查是否已登录
  useEffect(() => {
    const handleFocus = () => {
      setIsFocused(true);
      console.debug('Tab focused');
    };

    const handleBlur = () => {
      setIsFocused(false);
      console.debug('Tab blurred');
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur)

    // 检查是否已登录
    getLoginInfo().then(res => {
      // 检查登录状态
      if (!res.status) {
        console.error('directions: getLoginInfo fail.', res.message)
        navigate('/');
      }

      setLoginInfo(res)
      setIsFocused(true)
    })

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  // 流程状态追踪
  useEffect(() => {
    if (loginInfo.token === '' || !isFocused)
      return;

    request({
      url: `/api/get_process_status?token=${loginInfo.token}`,
      method: 'GET',
    }).then(res => {
      if (res.status !== 'success') {
        // setShowModal(true)
        // setModalContent(`预报到进度查询失败：${res.message}`)
        console.error('directions: getProcessStatus fail.', res.message)
        return
      }

      for (const [key, value] of Object.entries(res)) {
        let index = features.findIndex(feature => key === `${feature.id}_done`)

        if (index !== -1 && value === true && features[index].status !== 'disable') {
          setFeatures(draft => {
            draft[index].status = "true"
          })
        }
      }

    })

  }, [isFocused])

  return (<>
    <div className="overflow-hidden bg-white py-24 md:py-32 min-h-screen">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div
          className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">

          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <h2 className="text-base font-semibold leading-7 text-qlu">齐鲁工业大学</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">线上报到流程</p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                各位同学，请遵循以下流程完成线上报到。
              </p>
              <PageImage className="block md:hidden w-full h-[50vw]"/>
              <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                {features.map((feature) => (
                  <feature.action
                    key={feature.name}
                    to={feature.url}
                    target={feature.target}
                    onClick={() => feature.event({
                      id: feature.id,
                      loginInfo,
                      features: JSON.parse(JSON.stringify(features)),
                      feature
                    })}
                    className="block relative py-2 pl-11 border rounded border-transparent hover:border-gray-300 select-none cursor-pointer"
                  >
                    <dt className="inline font-semibold text-gray-900">
                      {/*<feature.icon className="absolute left-3 top-3 h-5 w-5 text-qlu" aria-hidden="true"/>*/}
                      {renderIcon(feature.status)}
                      {feature.name}
                    </dt>
                    <br/>
                    <dd
                      className="inline">{feature.status === 'true' ? feature.finishDescription : feature.description}</dd>
                  </feature.action>
                ))}
              </dl>
            </div>
          </div>

          <PageImage className="w-[48rem] h-[28.46rem] hidden md:block sm:w-[57rem] md:-ml-4 lg:-ml-0"/>

        </div>
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

function PageImage({className}) {
  return (<img
    // src="https://tailwindui.com/img/component-images/dark-project-app-screenshot.png"
    src="/assets/banner-raw-compressed.png"
    alt="logo"
    // className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
    className={`object-cover object-left-top max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 w-[2432px] h-[1442px] ${className}`}
  />)
}
