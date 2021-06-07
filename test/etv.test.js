/**
 * Funkcionalni testi
 */
(async function etv() {
  // Knjižnice
  const { exec } = require("child_process");
  const { describe, it, after, before } = require("mocha");
  const { Builder, By, until } = require("selenium-webdriver");
  const chrome = require("selenium-webdriver/chrome");
  const expect = require("chai").expect;

  // Parametri
  let aplikacijaUrl = "YOUR PRODUCTION URL/";
  let seleniumStreznikUrl = "http://localhost:4445/wd/hub";
  let brskalnik, jwtZeton;

  const axios = require('axios').create({
    baseURL: aplikacijaUrl + "api/",
    timeout: 5000
  });

  // Obvladovanje napak
  process.on("unhandledRejection", (napaka) => {
    console.log(napaka);
  });

  // Počakaj določeno število sekund na zahtevani element na strani
  let pocakajStranNalozena = async (brskalnik, casVS, xpath) => {
    await brskalnik.wait(() => {
      return brskalnik.findElements(By.xpath(xpath)).then(elementi => {
        return elementi[0];
      });
    }, casVS * 1000, `Stran se ni naložila v ${casVS} s.`);
  };

  try {
    // RESET baze
    before(() => {
    axios
        .get(aplikacijaUrl + 'api/brisidb')
        .then((odgovor) => {
            axios
                .get(aplikacijaUrl + 'api/polnidb')
                .then((odgovor) => {
                    console.log(odgovor)
                    })
                .catch((napaka) => {
                    console.log(napaka)
                  });
                })
        .catch((napaka) => {
            console.log(napaka)
        });
    });

    before(() => {
      brskalnik = new Builder()
      .forBrowser("chrome")
      .setChromeOptions(new chrome.Options()
        .addArguments("start-maximized")
        .addArguments("disable-infobars")
        .addArguments("allow-insecure-localhost")
        .addArguments("allow-running-insecure-content")
      )
      .usingServer(seleniumStreznikUrl)
      .build();
    });

    describe("Domaca stran", function() {
      this.timeout(30 * 1000);
      before(() => { brskalnik.get(aplikacijaUrl); });

      it("število člankov na začetni strani", async () => {
        await pocakajStranNalozena(brskalnik, 10, "//h4");
        let clanki = await brskalnik.findElements(By.css(".image-caption-text"));
        expect(lokacije).to.be.an("array").to.have.lengthOf(14);
      });

    });


    after(async () => {
      brskalnik.quit();
    });

  } catch (napaka) {
    console.log("Med testom je prišlo do napake!");
  }
})();
