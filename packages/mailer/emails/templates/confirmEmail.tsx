import Logo from '../../logo'
import { Body, Container, Head, Hr, Html, Preview, Section, Tailwind, Text } from '@react-email/components'

interface Props {
  code: string
}

const ConfirmEmailTemplate = ({ code }: Props) => {

  return (
    <Html>
      <Head />
      <Preview>Код подтверждения</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
          <Section className="mt-[32px]">
              <Logo />
            </Section>
            <Section className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Ваш код подтверждения почты
            </Section>
            <Section className="text-black text-[48px] font-normal text-center p-0 my-[30px] mx-0">
              {code}
            </Section>
            
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px] text-center">
              Если вы не запрашивали код подтверждения - игнорируйте сообщение.
              Не отвечайте на это сообщение, оно было сформировано автоматически.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

ConfirmEmailTemplate.PreviewProps = {
  code: "168968"
} as Props

export default ConfirmEmailTemplate