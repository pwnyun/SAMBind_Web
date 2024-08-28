import { Fragment, useState } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { HiCheck, HiChevronUpDown } from 'react-icons/hi2';

export default function ComboBox({ list, onSelectionChange, name }) {
  const [selected, setSelected] = useState(list[0]);
  const [query, setQuery] = useState('');

  const filteredPeople =
    query === ''
      ? list.filter(item => !!item)
      : list.filter((item) =>
        item && item.toLowerCase().replaceAll(/\s+/g, '').includes(query.toLowerCase().replaceAll(/\s+/g, ''))
      );


  function setChange(selection) {
    setSelected(selection);
    onSelectionChange(list.findIndex((item) => item === selection));
  }

  return (
    <div className="w-full bg-transparent">
      <Combobox selected={selected} onChange={setSelected} name={name}>
        <div className="relative bg-white/30">
          <div
            className="relative w-full cursor-default overflow-hidden rounded-lg bg-transparent text-left shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className="w-full border-none bg-transparent py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 caret-teal-600 backdrop-blur focus:ring-0"
              // @ts-ignore
              displayValue={ (item) => item }
              onChange={ (event) => setQuery(event.target.value) }
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <HiChevronUpDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </Combobox.Button>
          </div>
          <Transition
            as={ Fragment }
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={ () => setQuery('') }
          >
            <Combobox.Options
              className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white/75 py-1 text-base shadow-lg ring-2 ring-black/5 backdrop-blur focus:outline-none sm:text-sm">
              { filteredPeople.length === 0 && query !== '' ? (
                <div className="relative cursor-not-allowed select-none px-4 py-2 text-gray-700">
                  未找到匹配项
                </div>
              ) : (
                filteredPeople.map((item) => (
                  <Combobox.Option
                    key={ `options-${ item }` }
                    className={ ({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-teal-600 text-white' : 'text-gray-900'
                      }`
                    }
                    value={ item }
                  >
                    { ({ selected, active }) => (
                      <>
                        <span className={ `block truncate ${ selected ? 'font-medium' : 'font-normal' }` }>
                          { item }
                        </span>
                        { selected ? (
                          <span
                            className={ `absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-white' : 'text-teal-600'
                            }` }
                          >
                            <HiCheck className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null }
                      </>
                    ) }
                  </Combobox.Option>
                ))
              ) }
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}
