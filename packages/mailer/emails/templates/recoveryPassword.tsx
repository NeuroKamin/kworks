
import Logo from '../../logo'
import { Body, Button, Container, Head, Hr, Html, Link, Preview, Section, Tailwind, Text } from '@react-email/components'

interface Props {
  url: string
}

const RecoveryPasswordTemplate = ({ url }: Props) => {

  return <Html>
    <Head />
    <Preview>Восстановление доступа</Preview>
    <Tailwind>
      <Body className="bg-white my-auto mx-auto font-sans px-2">
        <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
          <Section className="mt-[32px]">
            <Logo />
          </Section>

          <Section className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
            Восстановление доступа к личному кабинету <strong>ГК КАМИН</strong>
          </Section>

          <Section className="text-center mt-[32px] mb-[32px]">
            <Button
              className="bg-blue-500 rounded text-white text-[12px] cursor-pointer font-semibold no-underline text-center px-5 py-3"
              href={url}
            >
              Восстановить пароль
            </Button>
          </Section>
          <Text className="text-black text-[14px] leading-[24px]">
            или скопируйте и вставьте эту ссылку в браузер:{" "}
            <Link href={url} className="text-blue-600 no-underline">
              {url}
            </Link>
          </Text>
          <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
          <Text className="text-[#666666] text-[12px] leading-[24px] text-center">
            Если вы не запрашивали восстановление пароля - игнорируйте это сообщение.
            Не отвечайте на это сообщение, оно было сформировано автоматически.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>

}

RecoveryPasswordTemplate.PreviewProps = {
  url: "http://localhost:3000/app"
} as Props

export default RecoveryPasswordTemplate