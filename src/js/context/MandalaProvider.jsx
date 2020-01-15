import React, { useReducer } from 'react'

const actions = {
	_CHANGE_VALUE : 1,
	_TOGGLE_LINES_ONLY: 2
}

const initialSettings = {
	color: [255, 255, 255, 255],
	mode: 1, // _FREEHAND
	sections: 32,
	accuracy: 15,
	strokeWidth: 3,
	reflect: true,
	showGuides: true,
	antialias: true,

	linesOnly: false,
	blackLines: false,
	forcedAlias: false,

	action: 'INITIALIZE'
}

const settingsReducer = (settings, action) => {
	switch(action.type){
		case actions._CHANGE_VALUE:
			return settings[action.attribute] === action.value ?
				settings :
				{
					...settings,
					[action.attribute]: action.value
				}
		case actions._TOGGLE_LINES_ONLY:
			return {
				...settings,
				linesOnly: !settings.linesOnly,
				blackLines: false,
				forcedAlias: false
			}
		case 3:
			return {
				...settings,
				action: 'EXE',
				method: action.method
			}
		default:
			return settings

	}	
}

const mandalaContext = React.createContext( initialSettings )
let renders = 0
const MandalaProvider = ({ children }) => {
	
	const [ settings, updateSettings ] = useReducer(
		settingsReducer,
		initialSettings
	)
	
	const contextValue = React.useMemo(
		() => {
			renders++
			console.log('renders', renders)
			return { settings, updateSettings }
		 },
		[ settings, updateSettings ]
	)

	return (
		<mandalaContext.Provider value={ contextValue }>
			{children}
		</mandalaContext.Provider>
	)
}

export { MandalaProvider, mandalaContext, actions }