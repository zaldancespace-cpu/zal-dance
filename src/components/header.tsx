import React from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Link } from "@heroui/react";
import { Icon } from "@iconify/react";

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  return (
    <Navbar 
      className="bg-background/80 backdrop-blur-md border-b border-default-200"
      maxWidth="xl"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarBrand>
        <a href="#about">
          <img src="/logo.png" alt="ЗАЛ" className="h-9 sm:h-11" />
        </a>
      </NavbarBrand>
      
      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#about" as="a">
            О зале
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#features" as="a">
            Удобства
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#pricing" as="a">
            Цены
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#rules" as="a">
            Правила
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#booking" as="a">
            Бронирование
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#contacts" as="a">
            Контакты
          </Link>
        </NavbarItem>
      </NavbarContent>
      
      <NavbarContent justify="end">
        <NavbarItem className="hidden sm:flex">
          <Button 
            as="a"
            color="primary" 
            href="#booking" 
            variant="flat" 
            className="accent-border"
            startContent={<Icon icon="lucide:calendar" />}
          >
            Забронировать
          </Button>
        </NavbarItem>
        <NavbarItem className="sm:hidden">
          <Button
            isIconOnly
            variant="light"
            onPress={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <Icon icon={isMenuOpen ? "lucide:x" : "lucide:menu"} width={24} height={24} />
          </Button>
        </NavbarItem>
      </NavbarContent>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-default-200 p-4 z-50">
          <div className="flex flex-col gap-2">
            <Link color="foreground" href="#about" as="a" className="py-2 px-4 hover:bg-default-100 rounded-md">
              О зале
            </Link>
            <Link color="foreground" href="#features" as="a" className="py-2 px-4 hover:bg-default-100 rounded-md">
              Удобства
            </Link>
            <Link color="foreground" href="#pricing" as="a" className="py-2 px-4 hover:bg-default-100 rounded-md">
              Цены
            </Link>
            <Link color="foreground" href="#rules" as="a" className="py-2 px-4 hover:bg-default-100 rounded-md">
              Правила
            </Link>
            <Link color="foreground" href="#booking" as="a" className="py-2 px-4 hover:bg-default-100 rounded-md">
              Бронирование
            </Link>
            <Link color="foreground" href="#contacts" as="a" className="py-2 px-4 hover:bg-default-100 rounded-md">
              Контакты
            </Link>
            <Button 
              as="a"
              color="primary" 
              href="#booking" 
              variant="flat" 
              className="accent-border mt-2"
              startContent={<Icon icon="lucide:calendar" />}
              fullWidth
            >
              Забронировать
            </Button>
          </div>
        </div>
      )}
    </Navbar>
  );
};