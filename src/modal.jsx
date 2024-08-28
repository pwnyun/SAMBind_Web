import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export default function Modal({
  isOpen,
  setIsOpen,
  title = '提示',
  children,
  buttonText = '确认',
  optionalButton = undefined,
}) {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10 print:hidden" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto backdrop-blur">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className="min-w-96 max-h-[1/3vh] w-full max-w-fit transform rounded-2xl bg-white/90 p-6 text-left align-middle shadow-xl backdrop-blur transition-all dark:bg-slate-800/80"
                >
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-200">
                    {title}
                  </Dialog.Title>
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className="max-h-96 ">{children}</div>
                  </div>

                  <div className="mt-4">
                    {optionalButton && optionalButton}

                    <button
                      type="button"
                      className={`inline-flex justify-center items-center rounded-md border border-transparent bg-blue-100 dark:bg-sky-900 ${
                        optionalButton && 'ml-4'
                      } px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:text-gray-300 dark:hover:bg-sky-950`}
                      onClick={() => setIsOpen(false)}
                    >
                      {buttonText}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
