export enum UserRoles {
  Admin = 'admin',
  Publisher = 'publisher',
  Contributor = 'contributor',
}

export enum AnnouncementStatus {
  Draft = 'draft',
  Published = 'published',
  Archived = 'archived',
  AcceptedProposal = 'accepted_proposal',
}

export enum ProposalDurationType {
  Day = 'day',
  Week = 'week',
  Month = 'month',
}

export enum MessageTypes {
  Text = 'text',
  Image = 'image',
  Video = 'video',
  Audio = 'audio',
  File = 'file',
}

export enum ChatStatus {
  Open = 'open',
  Closed = 'closed',
}
