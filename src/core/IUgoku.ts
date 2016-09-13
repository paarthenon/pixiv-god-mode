export interface UgokuFrameInformation {
	file :string
	delay :number
}
export interface UgokuInformation {
	src :string
	mime_type :string
	frames :UgokuFrameInformation[]
}
