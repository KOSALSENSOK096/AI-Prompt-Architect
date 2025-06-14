
import React, { useState, useId } from 'react';
import { PhoneOS, UIElementType, UIScreenElement, UIElementProperty } from '../types';
import ButtonIcon from '../components/icons/elements/ButtonIcon';
import TextInputIcon from '../components/icons/elements/TextInputIcon';
import ImageIcon from '../components/icons/elements/ImageIcon';
import HeaderIcon from '../components/icons/elements/HeaderIcon'; // Ensure this is imported
import TextBlockIcon from '../components/icons/elements/TextBlockIcon'; // Ensure this is imported
import TrashIcon from '../components/icons/TrashIcon'; 

const OS_OPTIONS: PhoneOS[] = ['Android', 'iOS', 'Windows', 'Generic'];
const UI_ELEMENT_PALETTE: { name: string; type: UIElementType; defaultProps: UIElementProperty, icon: React.FC<{className?: string}> }[] = [
  { name: 'Button', type: 'Button', defaultProps: { text: 'Button', fontSize: 'base', fontWeight: 'medium', alignment: 'center' }, icon: ButtonIcon },
  { name: 'Text Input', type: 'TextInput', defaultProps: { placeholder: 'Enter text...', fontSize: 'sm', fontWeight: 'normal' }, icon: TextInputIcon },
  { name: 'Header', type: 'Header', defaultProps: { text: 'Header Text', fontSize: 'xl', fontWeight: 'bold', alignment: 'left' }, icon: HeaderIcon },
  { name: 'Text Block', type: 'TextBlock', defaultProps: { text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', fontSize: 'base', fontWeight: 'normal', alignment: 'left' }, icon: TextBlockIcon },
  { name: 'Image', type: 'ImagePlaceholder', defaultProps: {}, icon: ImageIcon },
];

const UIDesignerPage: React.FC = () => {
  const [selectedOS, setSelectedOS] = useState<PhoneOS>('Android');
  const [screenElements, setScreenElements] = useState<UIScreenElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const pageIdPrefix = useId();

  const addElementToScreen = (type: UIElementType, defaultProps: UIElementProperty) => {
    const newElement: UIScreenElement = {
      id: `${pageIdPrefix}-${type}-${Date.now()}-${Math.random().toString(36).substring(2,7)}`, 
      type,
      properties: { ...defaultProps },
    };
    setScreenElements(prev => [...prev, newElement]);
    setSelectedElementId(newElement.id); 
  };

  const updateElementProperty = (id: string, propertyName: keyof UIElementProperty, value: any) => {
    setScreenElements(prev =>
      prev.map(el =>
        el.id === id ? { ...el, properties: { ...el.properties, [propertyName]: value } } : el
      )
    );
  };
  
  const selectedElement = screenElements.find(el => el.id === selectedElementId);

  const renderUIElement = (element: UIScreenElement, isSelected: boolean) => {
    const baseClasses = `p-2 my-1 w-full cursor-grab border-2 ${isSelected ? 'border-primary dark:border-primary-light ring-2 ring-primary dark:ring-primary-light ring-offset-2 ring-offset-white dark:ring-offset-slate-900 shadow-lg' : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md'} transition-all duration-150 ease-in-out`;
    const textAlignmentClass = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    }[element.properties.alignment || 'left'];
    
    const fontSizeClass = {
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    }[element.properties.fontSize || 'base'];

    const fontWeightClass = {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    }[element.properties.fontWeight || 'normal'];

    const commonTextClasses = `${fontSizeClass} ${fontWeightClass} ${textAlignmentClass}`;

    switch (element.type) {
      case 'Button':
        return (
          <button
            onClick={(e) => { e.stopPropagation(); setSelectedElementId(element.id);}}
            className={`${baseClasses} bg-primary hover:bg-primary-dark dark:bg-primary-dark dark:hover:bg-primary text-white rounded shadow-md active:shadow-inner ${commonTextClasses}`}
            style={{ textAlign: element.properties.alignment || 'center' }}
          >
            {element.properties.text || 'Button'}
          </button>
        );
      case 'TextInput':
        return (
          <input
            type="text"
            onClick={(e) => { e.stopPropagation(); setSelectedElementId(element.id);}}
            placeholder={element.properties.placeholder || 'Input'}
            className={`${baseClasses} bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600 rounded placeholder-slate-400 dark:placeholder-slate-500 focus:ring-1 focus:ring-primary-light ${commonTextClasses}`}
            readOnly 
          />
        );
      case 'ImagePlaceholder':
        return (
          <div
            onClick={(e) => { e.stopPropagation(); setSelectedElementId(element.id);}}
            className={`${baseClasses} bg-slate-300 dark:bg-slate-600 h-32 flex items-center justify-center rounded text-slate-500 dark:text-slate-400`}
            title="Image Placeholder"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
        );
      case 'Header':
        return (
          <h2 onClick={(e) => { e.stopPropagation(); setSelectedElementId(element.id);}} className={`${baseClasses} text-slate-800 dark:text-slate-100 ${commonTextClasses}`}>
            {element.properties.text || 'Header'}
          </h2>
        );
      case 'TextBlock':
        return (
          <p onClick={(e) => { e.stopPropagation(); setSelectedElementId(element.id);}} className={`${baseClasses} text-slate-700 dark:text-slate-300 ${commonTextClasses} leading-relaxed`}>
            {element.properties.text || 'Text block...'}
          </p>
        );
      default:
        return null;
    }
  };

  const renderPhoneChrome = () => {
    let statusBarContent, navBarContent;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    switch (selectedOS) {
      case 'iOS':
        statusBarContent = (
          <div className="h-10 bg-white dark:bg-black bg-opacity-80 dark:bg-opacity-30 text-black dark:text-slate-200 px-3 flex items-center justify-between text-xs font-medium relative z-10">
            <span>{time}</span>
            <div className="absolute left-1/2 top-1.5 -translate-x-1/2 w-20 h-5 bg-black rounded-b-lg"></div> {/* Notch/Island */}
            <div className="flex items-center space-x-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.059A7.5 7.5 0 0112 15c2.293 0 3.84.906 4.889 1.059m0 0c.403.063.806.096 1.211.096C19.883 16.155 21 14.88 21 13.5c0-1.657-1.343-3-3-3s-3 1.343-3 3c0 .704.269 1.35.697 1.845" /></svg>
              <span>LTE</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
          </div>
        );
        navBarContent = <div className="h-8 flex justify-center items-end pb-1.5"><div className="w-32 h-1 bg-black dark:bg-slate-500 rounded-full"></div></div>;
        break;
      case 'Windows': 
        statusBarContent = (
          <div className="h-6 bg-sky-600 dark:bg-sky-700 text-white px-2 flex items-center justify-end text-xs">
            <span>{time}</span>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.059A7.5 7.5 0 0112 15c2.293 0 3.84.906 4.889 1.059m0 0c.403.063.806.096 1.211.096C19.883 16.155 21 14.88 21 13.5c0-1.657-1.343-3-3-3s-3 1.343-3 3c0 .704.269 1.35.697 1.845" /></svg>
              <span>LTE</span>
          </div>
        );
        navBarContent = (
          <div className="h-12 bg-slate-800 dark:bg-black flex items-center justify-around">
            <button className="text-white p-2 rounded-full hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg></button>
            <button className="text-white p-2 rounded-full hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h8v8H3V3zm0 10h8v8H3v-8zM13 3h8v8h-8V3zm0 10h8v8h-8v-8z"/></svg></button>
            <button className="text-white p-2 rounded-full hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></button>
          </div>
        );
        break;
      case 'Android':
      default:
        statusBarContent = (
          <div className="h-6 bg-white dark:bg-slate-700 px-2 flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-600">
            <span>{time}</span>
            <div className="flex items-center space-x-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.059A7.5 7.5 0 0112 15c2.293 0 3.84.906 4.889 1.059m0 0c.403.063.806.096 1.211.096C19.883 16.155 21 14.88 21 13.5c0-1.657-1.343-3-3-3s-3 1.343-3 3c0 .704.269 1.35.697 1.845" /></svg>
              <span>5G</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
          </div>
        );
        navBarContent = (
          <div className="h-12 bg-white dark:bg-slate-700 flex items-center justify-around border-t border-slate-100 dark:border-slate-600">
            <button className="text-slate-600 dark:text-slate-300 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg></button>
            <button className="text-slate-600 dark:text-slate-300 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></button>
            <button className="text-slate-600 dark:text-slate-300 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg></button>
          </div>
        );
        break;
      case 'Generic':
         statusBarContent = <div className="h-6 bg-slate-400 dark:bg-slate-600"></div>;
         navBarContent = <div className="h-10 bg-slate-400 dark:bg-slate-600"></div>;
        break;
    }
    return { statusBarContent, navBarContent };
  };

  const { statusBarContent, navBarContent } = renderPhoneChrome();

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] overflow-hidden bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      {/* Controls Panel */}
      <aside className="w-full md:w-64 lg:w-72 bg-white dark:bg-slate-800 p-4 space-y-6 overflow-y-auto shadow-lg md:shadow-none md:border-r border-slate-200 dark:border-slate-700 transition-colors duration-300">
        <div>
          <label htmlFor="osSelector" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone OS</label>
          <select
            id="osSelector"
            value={selectedOS}
            onChange={(e) => setSelectedOS(e.target.value as PhoneOS)}
            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-slate-700 dark:text-slate-200 text-sm"
          >
            {OS_OPTIONS.map(os => <option key={os} value={os}>{os}</option>)}
          </select>
        </div>
        <div>
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">UI Elements</h3>
          <div className="space-y-2">
            {UI_ELEMENT_PALETTE.map(item => (
              <button
                key={item.type}
                onClick={() => addElementToScreen(item.type, item.defaultProps)}
                className="w-full flex items-center p-2 text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light"
                title={`Add ${item.name}`}
              >
                <item.icon className="w-4 h-4 mr-2 text-primary dark:text-primary-light flex-shrink-0" />
                <span className="text-slate-700 dark:text-slate-200">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
         <button 
            onClick={() => {
                setScreenElements([]);
                setSelectedElementId(null);
            }}
            title="Clear all elements from the screen"
            className="w-full mt-4 p-2 text-xs text-red-600 dark:text-red-400 border border-red-500 dark:border-red-500 rounded-md hover:bg-red-100 dark:hover:bg-red-700/50 transition-colors flex items-center justify-center focus:outline-none focus:ring-1 focus:ring-red-500"
        >
            <TrashIcon className="w-3.5 h-3.5 mr-1.5"/> Clear Screen
        </button>
      </aside>

      {/* Canvas Area */}
      <main className="flex-1 flex items-center justify-center p-2 sm:p-4 md:p-8 overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 transition-colors duration-300">
        <div 
          className="w-[280px] h-[580px] sm:w-[320px] sm:h-[660px] md:w-[360px] md:h-[740px] bg-neutral-900 dark:bg-black rounded-[40px] shadow-2xl p-1.5 sm:p-2 border-[6px] border-neutral-800 dark:border-neutral-950 flex flex-col overflow-hidden transition-all duration-300 ease-in-out"
        >
          {statusBarContent}
          <div 
            className="flex-grow bg-white dark:bg-slate-900 overflow-y-auto p-3 space-y-1 relative"
            onClick={(e) => { if (e.target === e.currentTarget) setSelectedElementId(null); }} 
            aria-label="UI Design Canvas"
          >
            {screenElements.map(el => renderUIElement(el, el.id === selectedElementId))}
            {screenElements.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-center p-4 pointer-events-none animate-fadeInUp">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2zM9 3v2m6-2v2m-3 7h.01M9 12h.01M15 12h.01M9 15h.01M15 15h.01" /></svg>
                    <p className="text-sm">Design your UI here.</p>
                    <p className="text-xs mt-1">Select an OS and add elements from the left panel.</p>
                </div>
            )}
          </div>
          {navBarContent}
        </div>
      </main>

      {/* Properties Panel */}
      <aside className="w-full md:w-64 lg:w-72 bg-white dark:bg-slate-800 p-4 space-y-4 overflow-y-auto shadow-lg md:shadow-none md:border-l border-slate-200 dark:border-slate-700 transition-colors duration-300">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 pb-2 border-b border-slate-200 dark:border-slate-700">Properties</h3>
        {selectedElement ? (
          <div className="space-y-3 text-sm animate-fadeInUp">
            <p className="text-xs text-slate-500 dark:text-slate-400">Editing: <span className="font-semibold text-primary dark:text-primary-light">{selectedElement.type}</span></p>
            {(selectedElement.type === 'Button' || selectedElement.type === 'Header' || selectedElement.type === 'TextBlock') && (
              <div>
                <label htmlFor={`${pageIdPrefix}-prop-text`} className="block text-xs font-medium text-slate-600 dark:text-slate-400">Text</label>
                <textarea
                  id={`${pageIdPrefix}-prop-text`}
                  rows={selectedElement.type === 'TextBlock' ? 3 : 2}
                  value={selectedElement.properties.text || ''}
                  onChange={(e) => updateElementProperty(selectedElement.id, 'text', e.target.value)}
                  className="mt-0.5 w-full p-1.5 border border-slate-300 dark:border-slate-600 rounded-md dark:bg-slate-700 dark:text-slate-200 text-xs focus:ring-1 focus:ring-primary dark:focus:ring-primary-light focus:border-primary dark:focus:border-primary-light"
                />
              </div>
            )}
            {selectedElement.type === 'TextInput' && (
              <div>
                <label htmlFor={`${pageIdPrefix}-prop-placeholder`} className="block text-xs font-medium text-slate-600 dark:text-slate-400">Placeholder</label>
                <input
                  type="text"
                  id={`${pageIdPrefix}-prop-placeholder`}
                  value={selectedElement.properties.placeholder || ''}
                  onChange={(e) => updateElementProperty(selectedElement.id, 'placeholder', e.target.value)}
                  className="mt-0.5 w-full p-1.5 border border-slate-300 dark:border-slate-600 rounded-md dark:bg-slate-700 dark:text-slate-200 text-xs focus:ring-1 focus:ring-primary dark:focus:ring-primary-light focus:border-primary dark:focus:border-primary-light"
                />
              </div>
            )}
             {(selectedElement.type === 'Button' || selectedElement.type === 'Header' || selectedElement.type === 'TextBlock' || selectedElement.type === 'TextInput') && (
                 <>
                    <div>
                        <label htmlFor={`${pageIdPrefix}-prop-fontSize`} className="block text-xs font-medium text-slate-600 dark:text-slate-400">Font Size</label>
                        <select id={`${pageIdPrefix}-prop-fontSize`} value={selectedElement.properties.fontSize || 'base'} onChange={(e) => updateElementProperty(selectedElement.id, 'fontSize', e.target.value as UIElementProperty['fontSize'])}
                         className="mt-0.5 w-full p-1.5 border border-slate-300 dark:border-slate-600 rounded-md dark:bg-slate-700 dark:text-slate-200 text-xs focus:ring-1 focus:ring-primary dark:focus:ring-primary-light focus:border-primary dark:focus:border-primary-light">
                            <option value="sm">Small</option><option value="base">Base</option><option value="lg">Large</option><option value="xl">Extra Large</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor={`${pageIdPrefix}-prop-fontWeight`} className="block text-xs font-medium text-slate-600 dark:text-slate-400">Font Weight</label>
                        <select id={`${pageIdPrefix}-prop-fontWeight`} value={selectedElement.properties.fontWeight || 'normal'} onChange={(e) => updateElementProperty(selectedElement.id, 'fontWeight', e.target.value as UIElementProperty['fontWeight'])}
                         className="mt-0.5 w-full p-1.5 border border-slate-300 dark:border-slate-600 rounded-md dark:bg-slate-700 dark:text-slate-200 text-xs focus:ring-1 focus:ring-primary dark:focus:ring-primary-light focus:border-primary dark:focus:border-primary-light">
                            <option value="normal">Normal</option><option value="medium">Medium</option><option value="semibold">SemiBold</option><option value="bold">Bold</option>
                        </select>
                    </div>
                 </>
             )}
             {(selectedElement.type === 'Button' || selectedElement.type === 'Header' || selectedElement.type === 'TextBlock') && (
                <div>
                    <label htmlFor={`${pageIdPrefix}-prop-alignment`} className="block text-xs font-medium text-slate-600 dark:text-slate-400">Alignment</label>
                    <select id={`${pageIdPrefix}-prop-alignment`} value={selectedElement.properties.alignment || 'left'} onChange={(e) => updateElementProperty(selectedElement.id, 'alignment', e.target.value as UIElementProperty['alignment'])}
                        className="mt-0.5 w-full p-1.5 border border-slate-300 dark:border-slate-600 rounded-md dark:bg-slate-700 dark:text-slate-200 text-xs focus:ring-1 focus:ring-primary dark:focus:ring-primary-light focus:border-primary dark:focus:border-primary-light">
                        <option value="left">Left</option><option value="center">Center</option><option value="right">Right</option>
                    </select>
                </div>
             )}

            <button 
                onClick={() => {
                    setScreenElements(prev => prev.filter(el => el.id !== selectedElementId));
                    setSelectedElementId(null);
                }}
                title="Delete selected element"
                className="w-full mt-6 p-2 text-xs text-red-600 dark:text-red-400 border border-red-500 dark:border-red-500 rounded-md hover:bg-red-100 dark:hover:bg-red-700/50 transition-colors flex items-center justify-center focus:outline-none focus:ring-1 focus:ring-red-500"
            >
                 <TrashIcon className="w-3.5 h-3.5 mr-1.5"/> Delete Element
            </button>
          </div>
        ) : (
          <p className="text-xs text-slate-500 dark:text-slate-400 italic">Select an element on the phone screen to edit its properties.</p>
        )}
      </aside>
    </div>
  );
};

export default UIDesignerPage;