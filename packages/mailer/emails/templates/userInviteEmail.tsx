import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Tailwind,

} from "@react-email/components";
import Logo from "../../logo";

interface Props {
  invitedByUsername?: string;
  invitedByEmail?: string;
  inviteLink?: string;
  spaceName?: string;
}

const UserInviteTemplate = ({ invitedByUsername, inviteLink,  spaceName, invitedByEmail }: Props) => {
  const previewText = spaceName ? `Присоединитесь к ${spaceName}`
    : `Присоединитесь к kworks`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
          <Section className="mt-[32px]">
              <Logo />
            </Section>
            <Section className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Присоединитесь к kworks 
            </Section>

            <Text className="text-black text-[14px] leading-[24px]">
              <strong>{invitedByUsername}</strong> (
              <Link
                href={`mailto:${invitedByEmail}`}
                className="text-blue-600 no-underline"
              >
                {invitedByEmail}
              </Link>
              ) пригласил вас в {
                spaceName ? <><strong>{spaceName}</strong> в kworks</>
                  : <>kworks</>
              }.
            </Text>

            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-blue-500 rounded text-white text-[12px] cursor-pointer font-semibold no-underline text-center px-5 py-3"
                href={inviteLink}
              >
                Принять приглашение
              </Button>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              или скопируйте и вставьте эту ссылку в браузер:{" "}
              <Link href={inviteLink} className="text-blue-600 no-underline">
                {inviteLink}
              </Link>
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px] text-center">
              Если вы не ожидали этого приглашения, или прото не хотите его принимать - игнорируйте это сообщение.
              Не отвечайте на это сообщение, оно было сформировано только для приглашения.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

UserInviteTemplate.PreviewProps = {
  inviteLink: "http://localhost:3000/invite",
  teamName: "ООО Ромашка",
  invitedByUsername: "Маврин Артем",
  invitedByEmail: "mavrin@kaminsoft.ru"
} as Props

export default UserInviteTemplate