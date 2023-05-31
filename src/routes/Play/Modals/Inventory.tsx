import { useState } from 'react'

// Typescript
import type { CurrentCharacter, InventoryItem } from 'redux/campaigns/types'
import type { ModalProps } from '.'

// Icons
import Icons from 'common/Icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons'
import { ReactComponent as Potion } from 'images/icons/flask-round-potion.svg'

// UI
import ChooseIcon from "common/ChooseIcon"

// Redux
import { useAppSelector } from 'core/redux'
import { updateViaSocket } from '../socket'

import Styles from '../_.module.sass'

const emptyInventorySlots = Array.from(new Array(10)).map((_, index) => index)
const maxInventoryTextLength = 17;

const NumbersOnlyRegex = new RegExp(/\D/gmi)

export default function Inventory({ close, meta }: ModalProps) {

  const myCharacterId = useAppSelector(state => state.play.myCharacterId)
  const ownerOfInventory = useAppSelector(state => meta?.playerId ? state.play.characters[meta.playerId] : state.play.myCharacter)

  const [state, setState] = useState(meta?.startState || {
    mode: 'view',
    editingSlot: null,
  })

  if (state.mode === 'edit' && ownerOfInventory) {
    return <EditSlot
      slotId={state.editingSlot}
      close={() => setState({ editingSlot: null, mode: 'view' })}
      closeModal={close}
      character={ownerOfInventory}
      defaults={state.editingSlot !== undefined ? ownerOfInventory.inventory[state.editingSlot] : undefined}
    />
  }

  return (
    <div className="modal-card">
      <header className="modal-card-head">
        <p className="modal-card-title">{ownerOfInventory && ownerOfInventory?.id !== myCharacterId ? `${ownerOfInventory.name}'s` : 'My'} Inventory</p>
        <button className="delete is-medium" onClick={close}></button>
      </header>
      <section className="modal-card-body">
        <InventoryList playerId={ownerOfInventory?.id || ''} onClick={(slotId) => {
          setState({ mode: 'edit', editingSlot: slotId })
        }} />
      </section>
      <footer className="modal-card-foot buttons is-right">
        <button className="button" type="button" onClick={close}>
          <span>Close</span>
        </button>
      </footer>
    </div>
  )
}

type EditSlotProps = {
  close: () => void,
  closeModal: () => void,
  slotId: number,
  character: CurrentCharacter,
  defaults?: InventoryItem
}
function EditSlot({ closeModal, slotId, defaults, character }: EditSlotProps): any {
  
  const [ choosingIcon, setChoosingIcon ] = useState(false)
  const [ icon, setIcon ] = useState(defaults?.icon || 'cube.svg')
  const [ name, setName ] = useState(defaults?.name || '')
  // const [ description, setDescription ] = useState(defaults?.description || '')
  const [ quantity, setQuantity ] = useState(defaults?.quantity || 1)

  if(choosingIcon !== false){
      return <ChooseIcon 
          current={icon}
          onChoose={(icon) => {
              if(icon){
                  setIcon(icon)
              }
              setChoosingIcon(false)
          }}
      />
  }

  const Icon = Icons[icon] || Icons['cube.svg']

  const addMode = !defaults

  const SaveButton = function(){
    return <button className="button is-primary" type="button" onClick={() => {
      updateViaSocket('character', {
        id: character.id,
        data: {
          ...character,
          inventory: {
            ...character.inventory,
            [slotId]: { 
              name,
              icon,
              quantity,
              description: ''
            }
          }
        }
      })
      closeModal()
    }}>
      <span>{ addMode ? 'Add Item' : 'Save' }</span>
    </button>
  }

  return <div className="modal-card">
      <header className="modal-card-head">
        <p className="modal-card-title">{ addMode ? 'Add to ' : 'Edit' } inventory</p>
        <button className="delete is-medium" onClick={closeModal}></button>
      </header>
      <section className="modal-card-body">
        <div className="block columns is-vcentered">

          <div className="column is-4">
            <figure className="image is-centered is-128x128 is-clickable" onClick={() => setChoosingIcon(true)}>
              <img src={Icon.element} alt={Icon.name} />
            </figure>
          </div>

          <div className="column">
            <div className="field">
              <label className="label input-label">Item Name</label>
              <div className="control has-icons-left">
                <input
                  autoFocus
                  className="input is-medium"
                  type="text"
                  value={name}
                  placeholder=""
                  onChange={({ target: { value } }) => setName(value)}
                  maxLength={maxInventoryTextLength}
                />
                <span className="icon is-left">
                  <Potion />
                </span>
              </div>
            </div>
            <div className="field">
              <label className="label input-label">Quantity</label>
              <div className="control has-icons-left">
                <input
                  className="input is-medium"
                  type="number"
                  value={String(quantity)}
                  onChange={({ target: { value } }) => {
                      value = value.replaceAll(NumbersOnlyRegex, '')
                      if (value === ''){
                        return setQuantity(1)
                      }
                      const intValue = parseInt(value)
                      if (isNaN(intValue) || intValue < 0) {
                        return
                      }
                      setQuantity(intValue)
                  }}
                  onKeyDown={({ keyCode }) => {
                    return keyCode !== 69
                  }}
                  placeholder=""
                />
                <span className="icon is-left">
                  <FontAwesomeIcon icon={faLayerGroup} />
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>
      <footer className="modal-card-foot buttons is-right">
        { !addMode
          ? <button className="button is-danger" type="button">
            <span>Remove</span>
          </button>
          : <></>
        }
        <SaveButton />
        <button className="button" type="button" onClick={closeModal}>
          <span>Back</span>
        </button>
      </footer>
    </div>
}

type InventoryListProps = {
  playerId: string,
  onClick?: (id: number, slot?: InventoryItem, playerId?: string) => void,
  isCompact?: boolean
}
export function InventoryList({ playerId, onClick, isCompact }: InventoryListProps) {
  const inventory = useAppSelector(state => state.play.characters[playerId]?.inventory) || {}

  return (
    <div className={`${Styles.Inventory} ${(isCompact ? ' ' + Styles.isCompact : '')}`}>{
      emptyInventorySlots.map((index) => {
        const item = inventory[index]
        return <InventorySlot
          id={index}
          key={index}
          slot={item}
          onClick={(id, slot) => onClick?.(id, slot, playerId)}
        />
      })
    }</div>
  )
}

export function InventorySlot({ id, slot, onClick }: { id: number, slot: InventoryItem, onClick?: (id: number, slot?: InventoryItem) => void }) {

  if (!slot || !slot.name) {
    return <div className={`${Styles.InventorySlot} ${Styles.isEmpty}`} onClick={() => onClick?.(id)} />
  }

  const { name, quantity } = slot
  const icon = Icons[slot.icon]?.element || Icons['cube.svg'].element

  return (
    <div className={Styles.InventorySlot} onClick={() => onClick?.(id, slot)}>

      <figure className={"image " + Styles.icon}>
        <img src={icon} alt={name} />
      </figure>

      <label className={"label " + Styles.inventoryLabel}>{name}</label>

      {quantity && quantity !== 1
        ? <p className={Styles.quantityLabel}>{quantity}</p>
        : <></>
      }

    </div>
  )
}
