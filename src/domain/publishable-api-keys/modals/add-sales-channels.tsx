import React, { useEffect, useRef, useState } from "react"
import { useAdminSalesChannels } from "medusa-react"
import { SalesChannel } from "@medusajs/medusa"

import SideModal from "../../../components/molecules/modal/side-modal"
import Button from "../../../components/fundamentals/button"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"
import InputField from "../../../components/molecules/input"
import SearchIcon from "../../../components/fundamentals/icons/search-icon"
import SalesChannelTable from "../tables/sales-channels-table"

const LIMIT = 12

type AddSalesChannelsSideModalProps = {
  close: () => void
  isVisible: boolean
  setSelectedChannels: (arg: any) => void
}
/**
 * Modal for adding sales channels to a new PK during creation.
 */
function AddSalesChannelsSideModal(props: AddSalesChannelsSideModalProps) {
  const tableRef = useRef()
  const { isVisible, close, setSelectedChannels } = props

  const [_selectedChannels, _setSelectedChannels] = useState<
    Record<number, SalesChannel>
  >({})

  const [offset, setOffset] = useState(0)
  const [search, setSearch] = useState("")

  const {
    sales_channels: data = [],
    isLoading,
    count,
  } = useAdminSalesChannels(
    { q: search, limit: LIMIT, offset },
    { keepPreviousData: true }
  )

  useEffect(() => {
    if (!props.isVisible) {
      setOffset(0)
      setSearch("")

      Object.values(_selectedChannels).map((channel) =>
        tableRef.current?.toggleRowSelected(channel.id, true)
      )
    }
  }, [props.isVisible])

  const onSave = () => {
    setSelectedChannels(_selectedChannels)
    props.close()
  }

  return (
    <SideModal close={close} isVisible={!!isVisible}>
      <div className="flex flex-col justify-between h-full p-6">
        {/* === HEADER === */}

        <div className="flex items-center justify-between">
          <h3 className="inter-large-semibold text-xl text-gray-900 flex items-center gap-2">
            Add sales channels
          </h3>
          <Button variant="secondary" className="p-2" onClick={props.close}>
            <CrossIcon size={20} className="text-grey-40" />
          </Button>
        </div>
        {/* === DIVIDER === */}

        <div className="flex-grow">
          <div className="my-8">
            <InputField
              small
              name="name"
              type="string"
              value={search}
              className="h-[32px]"
              placeholder="Find channels"
              prefix={<SearchIcon size={16} />}
              onChange={(ev) => setSearch(ev.target.value)}
            />
          </div>

          <SalesChannelTable
            ref={tableRef}
            query={search}
            data={data}
            offset={offset}
            count={count || 0}
            setOffset={setOffset}
            isLoading={isLoading}
            selectedChannels={_selectedChannels}
            setSelectedChannels={_setSelectedChannels}
          />
        </div>
        {/* === DIVIDER === */}

        <div
          className="h-[1px] bg-gray-200 block"
          style={{ margin: "24px -24px" }}
        />
        {/* === FOOTER === */}

        <div className="flex justify-end gap-2">
          <Button size="small" variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button
            size="small"
            variant="primary"
            onClick={onSave}
            // TODO: allow for empty as well (case where previous selection needs to be set to null)
            disabled={!Object.keys(_selectedChannels).length}
          >
            Save and close
          </Button>
        </div>
      </div>
    </SideModal>
  )
}

export default AddSalesChannelsSideModal