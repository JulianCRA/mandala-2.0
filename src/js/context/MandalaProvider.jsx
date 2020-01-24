import React, { useReducer } from 'react'

const actions = {
	_CHANGE_VALUE : 1,
	_TOGGLE_LINES_ONLY: 2,
	_UNDO: 3,
	_CLEAR: 4
}

const modes = {
	_FREE_HAND: 0,
	_STRAIGHT: 1,
	_FILL: 2
}

const initialSettings = {
	color: [255, 255, 255, 255],
	mode: modes._FREE_HAND,
	sections: 8,
	correctionAccuracy: 0.15,
	strokeWidth: 5,
	reflect: true,
	showGuides: true,
	antialias: true,

	linesOnly: false,
	blackLines: false,
	forcedAlias: false,

	state: 'INITIALIZE',
	attribute: null
}

const settingsReducer = (settings, action) => {
	switch(action.type){
		case actions._CHANGE_VALUE:
			return settings[action.attribute] === action.value ?
				settings :
				{
					...settings,
					attribute: action.attribute,
					state: "UPDATE_VALUE",
					[action.attribute]: action.value
				}
		case actions._TOGGLE_LINES_ONLY:
			return {
				...settings,
				linesOnly: !settings.linesOnly,
				blackLines: false,
				forcedAlias: false
			}
		case actions._UNDO:
			return {
					...settings,
					state: "UNDO"
				}
		case actions._CLEAR:
			return {
					...settings,
					state: "CLEAR"
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