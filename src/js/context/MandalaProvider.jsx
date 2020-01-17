import React, { useReducer } from 'react'

const actions = {
	_CHANGE_VALUE : 1,
	_TOGGLE_LINES_ONLY: 2,
	_CHANGE_COLOR: 3,
	_SET_MODE: 4,
	_SET_SECTIONS: 5
}

const modes = {
	_FREE_HAND: 0,
	_STRAIGHT: 1,
	_FILL: 2
}

const initialSettings = {
	color: [255, 255, 255, 255],
	mode: modes._FREE_HAND,
	sections: 32,
	accuracy: 15,
	strokeWidth: 3,
	reflect: true,
	showGuides: true,
	antialias: true,

	linesOnly: false,
	blackLines: false,
	forcedAlias: false,

	state: 'INITIALIZE'
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
		case actions._CHANGE_COLOR:
			return settings.color === action.value ?
				settings :
				{
					...settings,
					color: action.value,
					state: "CHANGE_COLOR"
				}
		case actions._SET_MODE:
			return settings.mode === action.value ?
				settings :
				{
					...settings,
					mode: action.value,
					state: "SET_MODE"
				}
		case actions._SET_SECTIONS:
			return settings.sections === action.value ?
				settings :
				{
					...settings,
					sections: action.value,
					state: "SET_SECTIONS"
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

export { MandalaProvider, mandalaContext, actions, modes }